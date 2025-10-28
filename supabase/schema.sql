-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 0 CHECK (quantity >= 0),
  price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  description TEXT,
  sku TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS products_category_id_idx ON products(category_id);
CREATE INDEX IF NOT EXISTS products_name_idx ON products(name);
CREATE INDEX IF NOT EXISTS products_sku_idx ON products(sku);

-- Enable Row Level Security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create policies for categories
CREATE POLICY "Allow public read access on categories" ON categories
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert access on categories" ON categories
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update access on categories" ON categories
  FOR UPDATE USING (true);

CREATE POLICY "Allow public delete access on categories" ON categories
  FOR DELETE USING (true);

-- Create policies for products
CREATE POLICY "Allow public read access on products" ON products
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert access on products" ON products
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update access on products" ON products
  FOR UPDATE USING (true);

CREATE POLICY "Allow public delete access on products" ON products
  FOR DELETE USING (true);

-- Create trigger function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default categories
INSERT INTO categories (name, description) VALUES
  ('Electronics', 'Electronic devices and components'),
  ('Clothing', 'Apparel and fashion items'),
  ('Home & Garden', 'Home improvement and garden supplies'),
  ('Books', 'Books and educational materials'),
  ('Sports', 'Sports equipment and accessories')
ON CONFLICT (name) DO NOTHING;