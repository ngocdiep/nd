begin;
 
 
create schema nd;
create schema nd_private;
 
create table nd.person (
  id               serial primary key,
  first_name       text not null check (char_length(first_name) < 80),
  last_name        text check (char_length(last_name) < 80),
  birthday         date,
  phone_number     text check(char_length(phone_number) < 31),
  avatar_url       text check (char_length(avatar_url) < 256),
  about            text,
  created_at       timestamp default now()
);
 
comment on table nd.person is 'A user of the application.';
comment on column nd.person.id is 'The primary unique identifier for the person.';
comment on column nd.person.first_name is 'The person’s first name.';
comment on column nd.person.last_name is 'The person’s last name.';
comment on column nd.person.birthday is 'The person’s birthday.';
comment on column nd.person.phone_number is 'The person’s phone number.';
comment on column nd.person.avatar_url is 'The person’s avatar url.';
comment on column nd.person.about is 'A short description about the user, written by the user.';
comment on column nd.person.created_at is 'The time this person was created.';
 
CREATE extension ltree;
create table nd.post_category (
  id                serial primary key,
  parent_id         integer references nd.post_category(id),
  parent_path       ltree,
  name              text not null check (char_length(name) < 80)
);
 
comment on table nd.post_category is 'A category of the post';
comment on column nd.post_category.id is 'The primary unique identifier for post category.';
comment on column nd.post_category.parent_id is 'The parent id of post category.';
comment on column nd.post_category.parent_path is 'The parent path of post category.';
comment on column nd.post_category.name is 'The name of post category.';
 
CREATE INDEX post_category_parent_path_idx ON nd.post_category USING GIST (parent_path);
CREATE INDEX post_category_parent_id_idx ON nd.post_category (parent_id);
 
create table nd.post (
  id               serial primary key,
  author_id        integer not null references nd.person(id),
  title            text not null check (char_length(title) < 280),
  content          text,
  summary         text check (char_length(title) < 300),
  category_id      integer references nd.post_category(id),
  created_at       timestamp default now()
);
 
comment on table nd.post is 'A post written by a user.';
comment on column nd.post.id is 'The primary key for the post.';
comment on column nd.post.title is 'The title written by the user.';
comment on column nd.post.author_id is 'The id of the author user.';
comment on column nd.post.category_id is 'The id of category this has been posted in.';
comment on column nd.post.content is 'The main content text of our post.';
comment on column nd.post.created_at is 'The time this post was created.';
 
alter default privileges revoke execute on functions from public;
 
create function nd.person_full_name(person nd.person) returns text as $$
  select person.first_name || ' ' || person.last_name
$$ language sql stable;
 
comment on function nd.person_full_name(nd.person) is 'A person’s full name which is a concatenation of their first and last name.';

create function nd.person_latest_post(person nd.person) returns nd.post as $$
  select post.*
  from nd.post as post
  where post.author_id = person.id
  order by created_at desc
  limit 1
$$ language sql stable;
 
comment on function nd.person_latest_post(nd.person) is 'Gets the latest post written by the person.';
 
create function nd.search_posts(search text) returns setof nd.post as $$
  select post.*
  from nd.post as post
  where post.title ilike ('%' || search || '%') or post.content ilike ('%' || search || '%')
$$ language sql stable;
 
comment on function nd.search_posts(text) is 'Returns posts containing a given search term.';
 
alter table nd.person add column updated_at timestamp default now();
alter table nd.post add column updated_at timestamp default now();
 
create function nd_private.set_updated_at() returns trigger as $$
begin
  new.updated_at := current_timestamp;
  return new;
end;
$$ language plpgsql;
 
create trigger person_updated_at before update
  on nd.person
  for each row
  execute procedure nd_private.set_updated_at();
 
create trigger post_updated_at before update
  on nd.post
  for each row
  execute procedure nd_private.set_updated_at();
   
CREATE OR REPLACE FUNCTION update_post_category_parent_path() RETURNS TRIGGER AS $$
    DECLARE
        path ltree;
    BEGIN
        IF NEW.parent_id IS NULL THEN
            NEW.parent_path = ''::ltree;
        ELSEIF TG_OP = 'INSERT' OR OLD.parent_id IS NULL OR OLD.parent_id != NEW.parent_id THEN
            SELECT parent_path || id::text FROM nd.post_category WHERE id = NEW.parent_id INTO path;
            IF path IS NULL THEN
                RAISE EXCEPTION 'Invalid parent_id %', NEW.parent_id;
            END IF;
            NEW.parent_path = path;
        END IF;
        RETURN NEW;
    END;
$$ LANGUAGE plpgsql;
 
CREATE TRIGGER parent_path_tgr
    BEFORE INSERT OR UPDATE ON nd.post_category
    FOR EACH ROW EXECUTE PROCEDURE update_post_category_parent_path();
 
create table nd_private.person_account (
  person_id        integer primary key references nd.person(id) on delete cascade,
  email            text not null unique check (email ~* '^.+@.+\..+$'),
  password_hash    text not null
);
 
comment on table nd_private.person_account is 'Private information about a person’s account.';
comment on column nd_private.person_account.person_id is 'The id of the person associated with this account.';
comment on column nd_private.person_account.email is 'The email address of the person.';
comment on column nd_private.person_account.password_hash is 'An opaque hash of the person’s password.';
 
create extension if not exists "pgcrypto";
 
create function nd.register_person(
  first_name text,
  last_name text,
  email text,
  password text
) returns nd.person as $$
declare
  person nd.person;
begin
  insert into nd.person (first_name, last_name) values
    (first_name, last_name)
    returning * into person;
 
  insert into nd_private.person_account (person_id, email, password_hash) values
    (person.id, email, crypt(password, gen_salt('bf')));
 
  return person;
end;
$$ language plpgsql strict security definer;

comment on function nd.register_person(text, text, text, text) is 'Registers a single user and creates an account in our application.';

create type nd.jwt_token as (
  role text,
  person_id integer
);

create function nd.register_person_and_sign_in(
  first_name text,
  last_name text,
  email text,
  password text
) returns nd.jwt_token as $$
declare
  person nd.person;
begin
  insert into nd.person (first_name, last_name) values
    (first_name, last_name)
    returning * into person;
 
  insert into nd_private.person_account (person_id, email, password_hash) values
    (person.id, email, crypt(password, gen_salt('bf')));
 
  return nd.authenticate(email, password);
end;
$$ language plpgsql strict security definer;
 
comment on function nd.register_person_and_sign_in(text, text, text, text) is 'Registers a single user, creates an account in our application and then sign in this user immediately.';
 
create role nd_postgraphile login password 'Abcd1234';
 
create role nd_anonymous;
grant nd_anonymous to nd_postgraphile;
 
create role nd_person;
grant nd_person to nd_postgraphile;
 
create function nd.authenticate(
  email text,
  password text
) returns nd.jwt_token as $$
declare
  account nd_private.person_account;
begin
  select a.* into account
  from nd_private.person_account as a
  where a.email = $1;
 
  if account.password_hash = crypt(password, account.password_hash) then
    return ('nd_person', account.person_id)::nd.jwt_token;
  else
    return null;
  end if;
end;
$$ language plpgsql strict security definer;
 
comment on function nd.authenticate(text, text) is 'Creates a JWT token that will securely identify a person and give them certain permissions.';
 
create function nd.current_person() returns nd.person as $$
  select *
  from nd.person
  where id = current_setting('jwt.claims.person_id', true)::integer
$$ language sql stable;
 
comment on function nd.current_person() is 'Gets the person who was identified by our JWT.';
 
grant usage on schema nd to nd_anonymous, nd_person;
 
grant select on table nd.person to nd_anonymous, nd_person;
grant update, delete on table nd.person to nd_person;
 
grant select on table nd.post to nd_anonymous, nd_person;
grant insert, update, delete on table nd.post to nd_person;
grant usage on sequence nd.post_id_seq to nd_person;
 
grant execute on function nd.person_full_name(nd.person) to nd_anonymous, nd_person;
grant execute on function nd.person_latest_post(nd.person) to nd_anonymous, nd_person;
grant execute on function nd.search_posts(text) to nd_anonymous, nd_person;
grant execute on function nd.authenticate(text, text) to nd_anonymous, nd_person;
grant execute on function nd.current_person() to nd_anonymous, nd_person;
 
grant execute on function nd.register_person(text, text, text, text) to nd_anonymous;
grant execute on function nd.register_person_and_sign_in(text, text, text, text) to nd_anonymous;
 
alter table nd.person enable row level security;
alter table nd.post enable row level security;
 
create policy select_person on nd.person for select
  using (true);
 
create policy select_post on nd.post for select
  using (true);
 
create policy update_person on nd.person for update to nd_person
  using (id = current_setting('jwt.claims.person_id', true)::integer);
 
create policy delete_person on nd.person for delete to nd_person
  using (id = current_setting('jwt.claims.person_id', true)::integer);
 
create policy insert_post on nd.post for insert to nd_person
  with check (author_id = current_setting('jwt.claims.person_id', true)::integer);
 
create policy update_post on nd.post for update to nd_person
  using (author_id = current_setting('jwt.claims.person_id', true)::integer);
 
create policy delete_post on nd.post for delete to nd_person
  using (author_id = current_setting('jwt.claims.person_id', true)::integer);
 
 
commit;