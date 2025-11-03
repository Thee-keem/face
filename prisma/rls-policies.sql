-- Enable Row Level Security on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE sale_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY user_isolation_policy ON users
  USING (id = current_user_id());

-- Create policies for categories table
CREATE POLICY category_read_policy ON categories
  FOR SELECT
  USING (true);

CREATE POLICY category_write_policy ON categories
  FOR ALL
  USING (current_user_role() IN ('ADMIN', 'MANAGER'));

-- Create policies for products table
CREATE POLICY product_read_policy ON products
  FOR SELECT
  USING (true);

CREATE POLICY product_write_policy ON products
  FOR ALL
  USING (current_user_role() IN ('ADMIN', 'MANAGER'));

-- Create policies for sales table
CREATE POLICY sale_read_policy ON sales
  FOR SELECT
  USING (user_id = current_user_id() OR current_user_role() IN ('ADMIN', 'MANAGER'));

CREATE POLICY sale_write_policy ON sales
  FOR INSERT
  WITH CHECK (user_id = current_user_id() OR current_user_role() IN ('ADMIN', 'MANAGER'));

CREATE POLICY sale_update_policy ON sales
  FOR UPDATE
  USING (user_id = current_user_id() OR current_user_role() IN ('ADMIN', 'MANAGER'));

-- Create policies for sale_items table
CREATE POLICY sale_item_read_policy ON sale_items
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM sales 
      WHERE sales.id = sale_items.sale_id 
      AND (sales.user_id = current_user_id() OR current_user_role() IN ('ADMIN', 'MANAGER'))
    )
  );

CREATE POLICY sale_item_write_policy ON sale_items
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM sales 
      WHERE sales.id = sale_items.sale_id 
      AND (sales.user_id = current_user_id() OR current_user_role() IN ('ADMIN', 'MANAGER'))
    )
  );

-- Create policies for inventory_alerts table
CREATE POLICY alert_read_policy ON inventory_alerts
  FOR SELECT
  USING (true);

CREATE POLICY alert_write_policy ON inventory_alerts
  FOR ALL
  USING (current_user_role() IN ('ADMIN', 'MANAGER'));

-- Create policies for expenses table
CREATE POLICY expense_read_policy ON expenses
  FOR SELECT
  USING (user_id = current_user_id() OR current_user_role() IN ('ADMIN', 'MANAGER'));

CREATE POLICY expense_write_policy ON expenses
  FOR ALL
  USING (user_id = current_user_id() OR current_user_role() IN ('ADMIN', 'MANAGER'));

-- Create functions for RLS
CREATE OR REPLACE FUNCTION current_user_id()
RETURNS TEXT AS $$
BEGIN
  RETURN current_setting('bolt.user_id', true);
EXCEPTION
  WHEN undefined_object THEN
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION current_user_role()
RETURNS TEXT AS $$
BEGIN
  RETURN current_setting('bolt.user_role', true);
EXCEPTION
  WHEN undefined_object THEN
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;