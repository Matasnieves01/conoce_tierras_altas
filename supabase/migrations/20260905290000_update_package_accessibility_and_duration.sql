-- Migration: Update package duration and difficulty/accessibility for top 3 tours
update public.packages
set 
  duration = case id
    when 'finca-la-suiza' then '4 Horas'
    when 'aventura-lagunas-volcan' then '6 a 8 Horas'
    when 'cascadas-finca-panama' then 'Máx. 10 Horas según clima'
    else duration
  end,
  difficulty = case id
    when 'finca-la-suiza' then 'Cualquier persona'
    when 'aventura-lagunas-volcan' then 'Aviso: Mayores y condición médica'
    when 'cascadas-finca-panama' then 'Advertencia: Terrenos difíciles'
    else difficulty
  end
where id in (
  'finca-la-suiza',
  'aventura-lagunas-volcan',
  'cascadas-finca-panama'
);
