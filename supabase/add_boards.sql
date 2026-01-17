-- 1. boards 테이블 생성
CREATE TABLE boards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  color VARCHAR(50) DEFAULT '#3b82f6',
  icon VARCHAR(50) DEFAULT 'layout-grid',
  position INTEGER NOT NULL DEFAULT 0,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. columns 테이블에 board_id 추가
ALTER TABLE columns ADD COLUMN board_id UUID REFERENCES boards(id) ON DELETE CASCADE;

-- 3. boards RLS 정책 설정
ALTER TABLE boards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own boards" ON boards
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own boards" ON boards
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own boards" ON boards
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own boards" ON boards
  FOR DELETE USING (auth.uid() = user_id);

-- user가 한 명일 경우
-- user_id를 cards 테이블에서 자동으로 가져와서 보드 생성
INSERT INTO boards (title, color, user_id, position) 
SELECT '기본 보드', '#3b82f6', user_id, 0
FROM cards
LIMIT 1;

-- columns 연결
UPDATE columns SET board_id = (SELECT id FROM boards LIMIT 1) WHERE board_id IS NULL;

-- NOT NULL 적용
ALTER TABLE columns ALTER COLUMN board_id SET NOT NULL;