-- 기본 태그 테이블 생성
CREATE TABLE IF NOT EXISTS tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  color TEXT,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(name, user_id)
);

-- 메모-태그 연결 테이블 (다대다 관계)
CREATE TABLE IF NOT EXISTS memo_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  memo_id UUID NOT NULL REFERENCES memos(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(memo_id, tag_id)
);

-- RLS 활성화
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE memo_tags ENABLE ROW LEVEL SECURITY;

-- tags 테이블 RLS 정책
CREATE POLICY "Users can view their own tags"
  ON tags FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own tags"
  ON tags FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tags"
  ON tags FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tags"
  ON tags FOR DELETE
  USING (auth.uid() = user_id);

-- memo_tags 테이블 RLS 정책
CREATE POLICY "Users can view their own memo tags"
  ON memo_tags FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM memos
      WHERE memos.id = memo_tags.memo_id
      AND memos.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create their own memo tags"
  ON memo_tags FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM memos
      WHERE memos.id = memo_tags.memo_id
      AND memos.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their own memo tags"
  ON memo_tags FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM memos
      WHERE memos.id = memo_tags.memo_id
      AND memos.user_id = auth.uid()
    )
  );

-- 인덱스 추가 (성능 향상)
CREATE INDEX idx_tags_user_id ON tags(user_id);
CREATE INDEX idx_memo_tags_memo_id ON memo_tags(memo_id);
CREATE INDEX idx_memo_tags_tag_id ON memo_tags(tag_id);
