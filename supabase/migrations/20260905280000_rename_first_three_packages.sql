update public.packages
set title = case id
  when 'finca-la-suiza' then 'Tour de Aventura'
  when 'aventura-lagunas-volcan' then 'Tour de Experiencia de Cafe'
  when 'cascadas-finca-panama' then 'Tour Aventura y experiencia de Cafe'
  else title
end
where id in (
  'finca-la-suiza',
  'aventura-lagunas-volcan',
  'cascadas-finca-panama'
);
