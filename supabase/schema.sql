-- Create columns table
CREATE TABLE IF NOT EXISTS columns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  position INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create cards table
CREATE TABLE IF NOT EXISTS cards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  column_id UUID NOT NULL REFERENCES columns(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  position INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS cards_column_id_idx ON cards(column_id);
CREATE INDEX IF NOT EXISTS cards_position_idx ON cards(position);
CREATE INDEX IF NOT EXISTS columns_position_idx ON columns(position);

-- Enable Row Level Security (RLS)
ALTER TABLE columns ENABLE ROW LEVEL SECURITY;
ALTER TABLE cards ENABLE ROW LEVEL SECURITY;

-- Create policies to allow all operations for now (you can customize these later)
CREATE POLICY "Enable read access for all users" ON columns FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON columns FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON columns FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON columns FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON cards FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON cards FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON cards FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON cards FOR DELETE USING (true);

-- Insert default columns
INSERT INTO columns (title, position) VALUES
  ('To Do', 0),
  ('In Progress', 1),
  ('Done', 2);
