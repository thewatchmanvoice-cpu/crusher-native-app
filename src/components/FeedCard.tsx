import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Heart, MessageCircle, Share2 } from 'lucide-react-native';
import { formatDistanceToNow } from 'date-fns';
import { Colors } from '@/constants/colors';
import { Spacing, Radius, Shadow } from '@/constants/spacing';
import { Typography } from '@/constants/typography';
import type { Post, Profile } from '@/types';

interface Props { post: Post; author?: Profile; onPress?: () => void; onLike?: () => void; onComment?: () => void; onShare?: () => void; }

export function FeedCard({ post, author, onPress, onLike, onComment, onShare }: Props) {
  const initials = (author?.name || 'U').split(' ').map(s => s[0]).join('').slice(0, 2).toUpperCase();
  return (
    <View style={[styles.wrap, Shadow.card]}>
      <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={styles.body}>
        <View style={styles.header}>
          {author?.avatar_url ? (
            <Image source={{ uri: author.avatar_url }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, { alignItems: 'center', justifyContent: 'center' }]}> 
              <Text style={{ color: Colors.primary, fontWeight: '700' }}>{initials}</Text>
            </View>
          )}
          <View style={{ flex: 1 }}>
            <Text style={Typography.bodyBold}>{author?.name || 'User'}</Text>
            <Text style={Typography.small}>{formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}</Text>
          </View>
        </View>
        {post.content && <Text style={[Typography.body, { marginTop: Spacing.sm }]}>{post.content}</Text>}
        {post.image_url && <Image source={{ uri: post.image_url }} style={styles.image} />}
      </TouchableOpacity>

      <View style={styles.actions}>
        <TouchableOpacity onPress={onLike} style={styles.actionBtn}><Heart size={18} color={Colors.textMuted} /></TouchableOpacity>
        <TouchableOpacity onPress={onComment} style={styles.actionBtn}><MessageCircle size={18} color={Colors.textMuted} /></TouchableOpacity>
        <TouchableOpacity onPress={onShare} style={styles.actionBtn}><Share2 size={18} color={Colors.textMuted} /></TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { backgroundColor: Colors.surface, borderRadius: Radius.xl, borderWidth: 1, borderColor: Colors.border, padding: Spacing.lg },
  body: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  avatar: { width: 40, height: 40, borderRadius: Radius.pill, backgroundColor: Colors.surfaceAlt },
  image: { width: '100%', aspectRatio: 1.2, borderRadius: Radius.lg, marginTop: Spacing.md, backgroundColor: Colors.surfaceAlt },
  actions: { flexDirection: 'row', gap: Spacing.lg, marginTop: Spacing.md },
  actionBtn: { padding: Spacing.xs },
});
