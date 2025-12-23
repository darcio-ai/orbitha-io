-- Criar 10 cupons específicos para o Beta Natal

-- Cupons Individuais (40 usos cada - 100% desconto)
INSERT INTO coupons (code, description, discount_type, discount_value, max_uses, valid_until, applicable_plans, active) VALUES
('BETANATAL-FIN', 'Beta Natal - Assistente Financeiro', 'percentage', 100, 40, '2025-01-15 23:59:59-03', ARRAY['life_balance'], true),
('BETANATAL-BUS', 'Beta Natal - Assistente Business', 'percentage', 100, 40, '2025-01-15 23:59:59-03', ARRAY['suite'], true),
('BETANATAL-VEN', 'Beta Natal - Assistente Vendas', 'percentage', 100, 40, '2025-01-15 23:59:59-03', ARRAY['growth'], true),
('BETANATAL-MKT', 'Beta Natal - Assistente Marketing', 'percentage', 100, 40, '2025-01-15 23:59:59-03', ARRAY['growth'], true),
('BETANATAL-SUP', 'Beta Natal - Assistente Suporte', 'percentage', 100, 40, '2025-01-15 23:59:59-03', ARRAY['growth'], true),
('BETANATAL-VIA', 'Beta Natal - Assistente Viagens', 'percentage', 100, 40, '2025-01-15 23:59:59-03', ARRAY['life_balance'], true),
('BETANATAL-FIT', 'Beta Natal - Assistente Fitness', 'percentage', 100, 40, '2025-01-15 23:59:59-03', ARRAY['life_balance'], true),

-- Cupons de Pacotes (10 usos cada - 100% desconto)
('BETANATAL-LB', 'Beta Natal - Life Balance Pack', 'percentage', 100, 10, '2025-01-15 23:59:59-03', ARRAY['life_balance'], true),
('BETANATAL-GR', 'Beta Natal - Growth Pack', 'percentage', 100, 10, '2025-01-15 23:59:59-03', ARRAY['growth'], true),
('BETANATAL-SU', 'Beta Natal - Orbitha Suite', 'percentage', 100, 10, '2025-01-15 23:59:59-03', ARRAY['suite'], true);