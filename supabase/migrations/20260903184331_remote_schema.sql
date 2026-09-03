drop extension if exists "pg_net";


  create table "public"."packages" (
    "id" uuid not null default gen_random_uuid(),
    "title" text not null,
    "description" text,
    "price" numeric not null,
    "category" text,
    "duration" text,
    "image" text,
    "created_at" timestamp with time zone default now()
      );


alter table "public"."packages" enable row level security;


  create table "public"."reservations" (
    "id" uuid not null default gen_random_uuid(),
    "package_id" uuid,
    "package_title" text not null,
    "client_name" text not null,
    "client_email" text not null,
    "client_phone" text,
    "people_count" integer not null,
    "reservation_date" date not null,
    "total_price" numeric not null,
    "status" text default 'pendiente'::text,
    "payment_method" text,
    "created_at" timestamp with time zone default now()
      );


alter table "public"."reservations" enable row level security;

CREATE UNIQUE INDEX packages_pkey ON public.packages USING btree (id);

CREATE UNIQUE INDEX reservations_pkey ON public.reservations USING btree (id);

alter table "public"."packages" add constraint "packages_pkey" PRIMARY KEY using index "packages_pkey";

alter table "public"."reservations" add constraint "reservations_pkey" PRIMARY KEY using index "reservations_pkey";

grant delete on table "public"."packages" to "anon";

grant insert on table "public"."packages" to "anon";

grant references on table "public"."packages" to "anon";

grant select on table "public"."packages" to "anon";

grant trigger on table "public"."packages" to "anon";

grant truncate on table "public"."packages" to "anon";

grant update on table "public"."packages" to "anon";

grant delete on table "public"."packages" to "authenticated";

grant insert on table "public"."packages" to "authenticated";

grant references on table "public"."packages" to "authenticated";

grant select on table "public"."packages" to "authenticated";

grant trigger on table "public"."packages" to "authenticated";

grant truncate on table "public"."packages" to "authenticated";

grant update on table "public"."packages" to "authenticated";

grant delete on table "public"."packages" to "service_role";

grant insert on table "public"."packages" to "service_role";

grant references on table "public"."packages" to "service_role";

grant select on table "public"."packages" to "service_role";

grant trigger on table "public"."packages" to "service_role";

grant truncate on table "public"."packages" to "service_role";

grant update on table "public"."packages" to "service_role";

grant delete on table "public"."reservations" to "anon";

grant insert on table "public"."reservations" to "anon";

grant references on table "public"."reservations" to "anon";

grant select on table "public"."reservations" to "anon";

grant trigger on table "public"."reservations" to "anon";

grant truncate on table "public"."reservations" to "anon";

grant update on table "public"."reservations" to "anon";

grant delete on table "public"."reservations" to "authenticated";

grant insert on table "public"."reservations" to "authenticated";

grant references on table "public"."reservations" to "authenticated";

grant select on table "public"."reservations" to "authenticated";

grant trigger on table "public"."reservations" to "authenticated";

grant truncate on table "public"."reservations" to "authenticated";

grant update on table "public"."reservations" to "authenticated";

grant delete on table "public"."reservations" to "service_role";

grant insert on table "public"."reservations" to "service_role";

grant references on table "public"."reservations" to "service_role";

grant select on table "public"."reservations" to "service_role";

grant trigger on table "public"."reservations" to "service_role";

grant truncate on table "public"."reservations" to "service_role";

grant update on table "public"."reservations" to "service_role";


