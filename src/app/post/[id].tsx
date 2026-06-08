import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, Image, KeyboardAvoidingView, Modal, Platform, ScrollView, Share, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { formatDistanceToNow } from 'date-fns';
import { ArrowLeft, Heart, MessageCircle } from 'lucide-react-native';

import { Colors } from '@/constants/colors';
import { Spacing, Radius, Shadow } from '@/constants/spacing';
import { Typography } from '@/constants/typography';
import { useAuth } from '@/hooks/useAuth';
import { fetchPostById, fetchPostComments, fetchPostLikes, fetchPostLikeByUser, fetchPostReactions, addCommentToPost, addReactionToPost, likePost, unlikePost } from '@/services/posts';
import type { PostComment, Profile } from '@/types';

export default function PostDetailScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const postId = params.id;
  const { user, loading: authLoading } = useAuth();
  const [postAuthor, setPostAuthor] = useState<Profile | null>(null);
  const [postContent, setPostContent] = useState<string | null>(null);
  const [postImage, setPostImage] = useState<string | null>(null);
  const [createdAt, setCreatedAt] = useState<string | null>(null);
  const [comments, setComments] = useState<PostComment[]>([]);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [reacting, setReacting] = useState(false);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [reactionSummary, setReactionSummary] = useState<Record<string, number>>({});

  const REACTION_OPTIONS = [
    { type: 'love', label: '❤️' },
    { type: 'fire', label: '🔥' },
    { type: 'laugh', label: '😂' },
    { type: 'wow', label: '😮' },
  ];

  const reactionTotal = useMemo(() => Object.values(reactionSummary).reduce((sum, count) => sum + count, 0), [reactionSummary]);
  const createdDate = useMemo(() => {
    if (!createdAt) return null;
    const date = new Date(createdAt);
    return Number.isNaN(date.getTime()) ? null : date;
  }, [createdAt]);

  useEffect(() => {
    if (!postId || authLoading) return;

    const load = async () => {
      setLoading(true);
      try {
        const [{ post, author }, comments, likes, reactions, liked] = await Promise.all([
          fetchPostById(postId),
          fetchPostComments(postId),
          fetchPostLikes(postId),
          fetchPostReactions(postId),
          user ? fetchPostLikeByUser(postId, user.id) : Promise.resolve(false),
        ]);

        if (!post) {
          Alert.alert('Not found', 'This post could not be loaded.');
          router.replace('/');
          return;
        }

        setPostAuthor(author);
        setPostContent(post.content);
        setPostImage(post.image_url);
        setCreatedAt(post.created_at);
        setComments(comments);
        setLikeCount(likes);
        setHasLiked(liked);
        setReactionSummary(reactions);
      } catch (error: any) {
        Alert.alert('Error', error?.message || 'Unable to load post');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [postId, authLoading]);

  const handleAddComment = async () => {
    if (!user) return;
    if (!commentText.trim()) return;

    setSubmitting(true);
    try {
      const newComment = await addCommentToPost(postId!, user.id, commentText.trim());
      setComments(prev => [...prev, newComment]);
      setCommentText('');
    } catch (error: any) {
      Alert.alert('Could not add comment', error?.message || 'Please try again');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = async () => {
    if (!user) return;
    try {
      if (hasLiked) {
        await unlikePost(postId!, user.id);
        setLikeCount(count => Math.max(count - 1, 0));
        setHasLiked(false);
      } else {
        await likePost(postId!, user.id);
        setLikeCount(count => count + 1);
        setHasLiked(true);
      }
    } catch (error: any) {
      Alert.alert('Unable to update like', error?.message || 'Please try again');
    }
  };

  const handleShare = async () => {
    if (!postId) return;
    try {
      await Share.share({ message: `https://crushr.com/post/${postId}` });
    } catch (error: any) {
      if (error?.message) Alert.alert('Unable to share', error.message);
    }
  };

  const openImageModal = () => setImageModalVisible(true);
  const closeImageModal = () => setImageModalVisible(false);

  const handleReact = async (reactionType: string) => {
    if (!user) return;
    setReacting(true);
    try {
      await addReactionToPost(postId!, user.id, reactionType);
      const updatedReactions = await fetchPostReactions(postId!);
      setReactionSummary(updatedReactions);
    } catch (error: any) {
      Alert.alert('Unable to add reaction', error?.message || 'Please try again');
    } finally {
      setReacting(false);
    }
  };

  if (loading || authLoading) {
    return (
      <SafeAreaView style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={20} color={Colors.text} />
        </TouchableOpacity>
        <Text style={Typography.h3}>Post</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={[styles.postCard, Shadow.card]}>
          <View style={styles.postHeader}>
            <View style={[styles.avatar, { alignItems: 'center', justifyContent: 'center' }]}> 
              <Text style={{ color: Colors.primary, fontWeight: '700' }}>{(postAuthor?.name || 'U').split(' ').map(s => s[0]).join('').slice(0, 2).toUpperCase()}</Text>
            </View>
            <View style={{ flex: 1, marginLeft: Spacing.md }}>
              <Text style={Typography.bodyBold}>{postAuthor?.name || 'User'}</Text>
              <Text style={Typography.small}>
                {createdDate ? formatDistanceToNow(createdDate, { addSuffix: true }) : 'Unknown time'}
              </Text>
            </View>
          </View>

          {postContent ? <Text style={[Typography.body, { marginTop: Spacing.md }]}>{postContent}</Text> : null}
          {postImage ? (
            <TouchableOpacity onPress={openImageModal} activeOpacity={0.85}>
              <Image source={{ uri: postImage }} style={styles.postImage} />
            </TouchableOpacity>
          ) : null}

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Heart size={18} color={Colors.primary} />
              <Text style={Typography.caption}>{likeCount} likes</Text>
            </View>
            <View style={styles.statItem}>
              <MessageCircle size={18} color={Colors.textMuted} />
              <Text style={Typography.caption}>{comments.length} comments</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={Typography.caption}>{reactionTotal} reactions</Text>
            </View>
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity onPress={handleLike} style={[styles.primaryButton, hasLiked && styles.likedButton]}>
              <Heart size={18} color={hasLiked ? Colors.primary : '#fff'} style={{ marginRight: 8 }} />
              <Text style={[styles.primaryButtonText, hasLiked && { color: Colors.primary }]}>{hasLiked ? 'Liked' : 'Like'}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleShare} style={[styles.primaryButton, styles.secondaryButton]}>
              <Text style={styles.primaryButtonText}>Share</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={Typography.h4}>Reactions</Text>
          <View style={styles.reactionButtonsRow}>
            {REACTION_OPTIONS.map(option => (
              <TouchableOpacity
                key={option.type}
                onPress={() => handleReact(option.type)}
                disabled={reacting}
                style={styles.reactionOption}
              >
                <Text style={styles.reactionOptionText}>{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {reactionTotal === 0 ? (
            <Text style={Typography.caption}>No reactions yet</Text>
          ) : (
            Object.entries(reactionSummary).map(([type, count]) => (
              <View key={type} style={styles.reactionRow}>
                <Text style={Typography.bodyBold}>{type}</Text>
                <Text style={Typography.caption}>{count}</Text>
              </View>
            ))
          )}
        </View>

        <View style={styles.section}>
          <Text style={Typography.h4}>Comments</Text>
          {comments.length === 0 ? (
            <Text style={Typography.caption}>Be first to comment.</Text>
          ) : (
            comments.map(comment => (
              <View key={comment.id} style={styles.commentCard}>
                <Text style={Typography.bodyBold}>{comment.author?.name || 'Anonymous'}</Text>
                <Text style={Typography.caption}>{formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}</Text>
                <Text style={[Typography.body, { marginTop: Spacing.sm }]}>{comment.content}</Text>
              </View>
            ))
          )}
        </View>

        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.commentInputWrapper}>
          <TextInput
            placeholder="Add a comment..."
            placeholderTextColor={Colors.textMuted}
            value={commentText}
            onChangeText={setCommentText}
            style={styles.commentInput}
            multiline
          />
          <TouchableOpacity onPress={handleAddComment} disabled={submitting || !commentText.trim()} style={[styles.primaryButton, (submitting || !commentText.trim()) && { opacity: 0.6 }]}> 
            <Text style={styles.primaryButtonText}>{submitting ? 'Posting...' : 'Post'}</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </ScrollView>
      <Modal visible={imageModalVisible} transparent onRequestClose={closeImageModal}>
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={closeImageModal}>
            <Image source={{ uri: postImage || '' }} style={styles.modalImage} />
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md, borderBottomColor: Colors.border, borderBottomWidth: 1, backgroundColor: Colors.background },
  backButton: { width: 40, height: 40, borderRadius: Radius.pill, backgroundColor: Colors.surface, alignItems: 'center', justifyContent: 'center' },
  content: { padding: Spacing.lg, gap: Spacing.lg, paddingBottom: 30 },
  postCard: { backgroundColor: Colors.surface, borderRadius: Radius.xl, borderWidth: 1, borderColor: Colors.border, padding: Spacing.lg },
  postHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  avatar: { width: 44, height: 44, borderRadius: Radius.pill, backgroundColor: Colors.surfaceAlt },
  postImage: { width: '100%', height: 200, borderRadius: Radius.lg, marginTop: Spacing.md, backgroundColor: Colors.surfaceAlt },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: Spacing.lg },
  statItem: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs },
  buttonRow: { marginTop: Spacing.lg, flexDirection: 'row', gap: Spacing.md },
  primaryButton: { backgroundColor: Colors.primary, padding: Spacing.lg, borderRadius: Radius.lg, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', flex: 1 },
  primaryButtonText: { color: '#fff', fontWeight: '700' },
  likedButton: { backgroundColor: '#fff', borderWidth: 2, borderColor: Colors.primary },
  section: { gap: Spacing.sm },
  reactionRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: Spacing.sm, borderBottomWidth: 1, borderBottomColor: Colors.border },
  commentCard: { backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: Spacing.lg, marginTop: Spacing.sm, borderWidth: 1, borderColor: Colors.border },
  commentInputWrapper: { gap: Spacing.sm },
  commentInput: { backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.lg, padding: Spacing.lg, color: Colors.text, minHeight: 100, textAlignVertical: 'top' },
  reactionButtonsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginTop: Spacing.sm },
  reactionOption: { paddingVertical: Spacing.sm, paddingHorizontal: Spacing.md, borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.pill, backgroundColor: Colors.surface },
  reactionOptionText: { fontSize: 16 },
  secondaryButton: { backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.primary },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.9)', justifyContent: 'center', alignItems: 'center' },
  modalImage: { width: '100%', height: '100%', resizeMode: 'contain' },
});
