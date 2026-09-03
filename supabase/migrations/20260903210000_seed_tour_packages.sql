alter table public.packages
  alter column id type text using id::text;

alter table public.packages
  add column if not exists icon text,
  add column if not exists long_description text,
  add column if not exists difficulty text,
  add column if not exists location text,
  add column if not exists includes text[] not null default '{}',
  add column if not exists highlights text[] not null default '{}',
  add column if not exists gallery text[] not null default '{}',
  add column if not exists class_name text;

insert into public.packages (
  id, icon, title, price, category, duration, difficulty, location,
  description, long_description, includes, highlights, image, gallery, class_name
)
values
(
  'finca-la-suiza',
  '☕',
  'Finca la Suiza',
  120,
  'Tour Cafetalero & Naturaleza',
  '5 - 6 Horas',
  'Fácil - Moderado',
  'Paso Ancho, Tierras Altas',
  'Una experiencia completa para conocer el proceso del café, la naturaleza y la cultura local.',
  'Sumérgete en la tradición agrícola de Tierras Altas con un recorrido detallado por la histórica Finca la Suiza. Conocerás de la mano de expertos las etapas desde el cultivo, cosecha, despulpado hasta el secado tradicional y tostado.',
  array['Transporte 4x4', 'Visita a Finca la Suiza', 'Visita a Finca Drácula', 'Almuerzo', 'Snacks', 'Cata de Café'],
  array['Paseo guiado por plantaciones de café arábica de altura', 'Demostración de beneficio y métodos de secado', 'Visita al mirador panorámico del valle de Paso Ancho', 'Cata y degustación de café fresco de especialidad'],
  'Paquete1.jpg',
  array['Paquete1.jpg', 'coffee-finca.jpg', 'coffee-drying.jpg', 'coffee-cupping.jpg'],
  'package-card--one'
),
(
  'aventura-lagunas-volcan',
  '🚙',
  'Lagunas de Volcán',
  90,
  'Aventura 4x4 & Senderos',
  '4 - 5 Horas',
  'Moderado (4x4)',
  'Humedal Lagunas de Volcán',
  'Para quienes buscan aventura, paisajes increíbles y recorridos en 4x4.',
  'Vive la emoción todoterreno subiendo a las lagunas más altas de Panamá. Una travesía 4x4 enérgica que te llevará a través de senderos volcánicos, bosques de niebla y humedales protegidos con vistas panorámicas únicas.',
  array['Transporte 4x4', 'Visita a las Lagunas de Volcán', 'Caminata por senderos ecológicos', 'Almuerzo campestre', 'Snacks e hidratación'],
  array['Ruta safari 4x4 todoterreno por caminos volcánicos', 'Avistamiento de aves de altura y flora endémica', 'Punto de picnic frente a la laguna principal', 'Café caliente de altura preparado en el sitio'],
  'Paquete2.jpg',
  array['Paquete2.jpg', 'mountain-road.jpg', 'volcan-lagoon.jpg', 'cloud-forest.jpg'],
  'package-card--two'
),
(
  'cascadas-finca-panama',
  '✦',
  'Cascadas y Finca Panamá',
  110,
  'Senderismo & Bosque Nuboso',
  '6 Horas',
  'Moderado',
  'Finca Panamá & Mount Totumas',
  'Un recorrido pensado para disfrutar con tranquilidad, buena comida y paisajes únicos.',
  'Un día de reconexión pura con la naturaleza. Visita caídas de agua cristalinas rodeadas de vegetación virgen, cafetales familiares y culmina con un almuerzo exclusivo en las faldas de la reserva de Mount Totumas.',
  array['Transporte 4x4 todo el día', 'Visita a las cascadas de la finca Panamá y cafetales', 'Visita a Mi Finquita y recorrido por sus instalaciones', 'Visita a la reserva de Mount Totumas', 'Almuerzo gourmet en Mount Totumas', 'Snacks e hidratación continua'],
  array['Caminata guiada hacia cascadas escondidas en el bosque', 'Paso por cafetales tradicionales de Finca Panamá', 'Parada en Mi Finquita y sus instalaciones modelo', 'Visita y almuerzo exclusivo en Mount Totumas'],
  'Paquete3.jpg',
  array['Paquete3.jpg', 'waterfall-trail.jpg', 'cloud-forest.jpg', 'mount-totumas.jpg'],
  'package-card--three'
),
(
  'finca-mi-finquita',
  '☕',
  'Finca Cafetal Mi Finquita',
  150,
  'Safari Premium Coffee',
  '5 - 6 Horas',
  'Aventura 4x4 & Cata',
  'Finca Mi Finquita, Volcán',
  'Una inmersión exclusiva en los cafetales y procesos de café de especialidad en Mi Finquita.',
  'Un safari 4x4 premium diseñado para los apasionados del café de especialidad. Conocerás de primera mano variedades exóticas como Geisha y Pacamara, técnicas de fermentación innovadoras y una cata sensorial privada dirigida por un barista profesional.',
  array['Transporte 4x4 especializado', 'Recorrido guiado por cafetales de altura', 'Demostración del proceso de beneficio y secado', 'Cata privada de café Geisha guiada por barista', 'Snack campestre y café de cortesía'],
  array['Safari 4x4 por parcelas de variedades exóticas', 'Laboratorio de fermentación y secado artesanal', 'Cata privada de café Geisha de altura', 'Almuerzo gourmet con maridaje de café'],
  'Paquete2.jpg',
  array['Paquete2.jpg', 'coffee-finca.jpg', 'coffee-lab.jpg', 'coffee-cupping.jpg'],
  'package-card--safari-one'
),
(
  'finca-santos-cafe',
  '🚙',
  'Finca Santos Café',
  135,
  'Safari Premium Coffee',
  '5 - 6 Horas',
  'Aventura 4x4',
  'Finca Santos, Tierras Altas',
  'Aventura en 4x4 cruzando senderos cafetaleros con paradas en miradores y degustación en Finca Santos.',
  'Asciende por las colinas cafetaleras de Finca Santos en nuestros vehículos 4x4 adaptados. Disfruta de vistas espectaculares del valle, brisas frescas de montaña y degustaciones de café filtrado al aire libre preparadas al momento.',
  array['Ruta todoterreno 4x4 por fincas cafetaleras', 'Paradas fotográficas en miradores del Volcán Barú', 'Degustación de café filtrado al aire libre', 'Almuerzo típico gourmet', 'Hidratación durante todo el recorrido'],
  array['Ruta off-road 4x4 por senderos de montaña', 'Miradores panorámicos del Volcán Barú', 'Preparación de café en métodos al aire libre', 'Almuerzo tradicional de campo'],
  'Paquete3.jpg',
  array['Paquete3.jpg', 'mountain-road.jpg', 'coffee-brewing.jpg', 'volcan-baru.jpg'],
  'package-card--safari-two'
),
(
  'finca-santa-teresa',
  '✦',
  'Finca Santa Teresa',
  195,
  'Safari Premium Coffee',
  '6 - 7 Horas',
  'Experiencia Gourmet',
  'Finca Santa Teresa, Paso Ancho',
  'Experiencia de clase mundial en Finca Santa Teresa con tueste artesanal y cata sensorial.',
  'La experiencia cafetalera definitiva en Panamá. Finca Santa Teresa te abre sus puertas para conocer lotes ganadores de la Best of Panama, el fascinante proceso de tueste y una cata sensorial guiada por catadores Q-Grader.',
  array['Transporte safari 4x4 de lujo', 'Paseo por las parcelas de mayor altitud', 'Taller de tueste y extracción de café', 'Cata profesional de café de especialidad', 'Almuerzo gourmet en terraza con vista al volcán'],
  array['Recorrido por lotes premiados internacionalmente', 'Demostración de tueste en vivo y perfiles de sabor', 'Cata sensorial formal guiada por Q-Grader', 'Maridaje y tabla de quesos y productos locales'],
  'Paquete1.jpg',
  array['Paquete1.jpg', 'coffee-roasting.jpg', 'coffee-cupping.jpg', 'volcan-view.jpg'],
  'package-card--safari-three'
)
on conflict (id) do update set
  icon = excluded.icon,
  title = excluded.title,
  price = excluded.price,
  category = excluded.category,
  duration = excluded.duration,
  difficulty = excluded.difficulty,
  location = excluded.location,
  description = excluded.description,
  long_description = excluded.long_description,
  includes = excluded.includes,
  highlights = excluded.highlights,
  image = excluded.image,
  gallery = excluded.gallery,
  class_name = excluded.class_name;

alter table public.packages enable row level security;

drop policy if exists "Public can read packages" on public.packages;
create policy "Public can read packages"
  on public.packages for select
  to anon, authenticated
  using (true);
