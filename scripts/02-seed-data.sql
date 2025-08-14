-- Insert sample users
INSERT INTO users (id, email, user_type, full_name, phone) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'john@example.com', 'tenant', 'John Smith', '+1-555-0101'),
('550e8400-e29b-41d4-a716-446655440002', 'sarah@example.com', 'landlord', 'Sarah Johnson', '+1-555-0102'),
('550e8400-e29b-41d4-a716-446655440003', 'mike@example.com', 'tenant', 'Mike Davis', '+1-555-0103'),
('550e8400-e29b-41d4-a716-446655440004', 'emma@example.com', 'landlord', 'Emma Wilson', '+1-555-0104')
ON CONFLICT (email) DO NOTHING;

-- Insert sample properties
INSERT INTO properties (id, landlord_id, title, description, price, property_type, bedrooms, bathrooms, area_sqft, address, city, state, zip_code, latitude, longitude, amenities, images, available_from) VALUES
('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', 'Modern Downtown Apartment', 'Beautiful 2-bedroom apartment in the heart of downtown with stunning city views.', 2500.00, 'apartment', 2, 2, 1200, '123 Main St', 'New York', 'NY', '10001', 40.7128, -74.0060, ARRAY['gym', 'pool', 'parking', 'laundry'], ARRAY['/modern-apartment-living-room.png', '/modern-apartment-bedroom.png', '/modern-apartment-kitchen.png'], '2024-02-01'),
('660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440004', 'Cozy Studio Near Park', 'Charming studio apartment with park views and modern amenities.', 1800.00, 'studio', 1, 1, 600, '456 Park Ave', 'New York', 'NY', '10002', 40.7589, -73.9851, ARRAY['gym', 'doorman', 'pet-friendly'], ARRAY['/panoramic-living-room.png', '/360-bedroom-view.png'], '2024-02-15'),
('660e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', 'Luxury Penthouse Suite', 'Exclusive penthouse with panoramic city views and premium finishes.', 5000.00, 'penthouse', 3, 3, 2500, '789 Fifth Ave', 'New York', 'NY', '10003', 40.7614, -73.9776, ARRAY['gym', 'pool', 'concierge', 'parking', 'balcony'], ARRAY['/modern-apartment-living-room.png', '/modern-apartment-bedroom.png'], '2024-03-01')
ON CONFLICT (id) DO NOTHING;
