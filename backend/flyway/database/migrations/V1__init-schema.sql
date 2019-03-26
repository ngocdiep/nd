BEGIN;

CREATE SCHEMA nd;

CREATE SCHEMA nd_private;

CREATE FUNCTION nd_private.set_updated_at ()
    RETURNS TRIGGER
    AS $$
BEGIN
    new.updated_at := CURRENT_TIMESTAMP;
    RETURN new;
END;
$$
LANGUAGE plpgsql;

CREATE TABLE nd.person (
    id serial PRIMARY KEY,
    first_name text NOT NULL CHECK (char_length(first_name) < 80),
    last_name text CHECK (char_length(last_name) < 80),
    birthday date,
    phone_number text CHECK (char_length(phone_number) < 31),
    avatar_url text CHECK (char_length(avatar_url) < 256),
    about text,
    created_at timestamp DEFAULT now(),
    updated_at timestamp DEFAULT now()
);

COMMENT ON TABLE nd.person IS 'A user of the application.';

COMMENT ON COLUMN nd.person.id IS 'The primary unique identifier for the person.';

COMMENT ON COLUMN nd.person.first_name IS 'The person’s first name.';

COMMENT ON COLUMN nd.person.last_name IS 'The person’s last name.';

COMMENT ON COLUMN nd.person.birthday IS 'The person’s birthday.';

COMMENT ON COLUMN nd.person.phone_number IS 'The person’s phone number.';

COMMENT ON COLUMN nd.person.avatar_url IS 'The person’s avatar url.';

COMMENT ON COLUMN nd.person.about IS 'A short description about the user, written by the user.';

COMMENT ON COLUMN nd.person.created_at IS 'The time this person was created.';

COMMENT ON COLUMN nd.person.updated_at IS 'The time this person was updated.';

CREATE TRIGGER person_updated_at
    BEFORE UPDATE ON nd.person FOR EACH ROW
    EXECUTE PROCEDURE nd_private.set_updated_at ();

CREATE TYPE nd.post_status as enum (
    'IN_PROGRESS',
    'READY_TO_REVIEW',
    'REVIEWING',
    'REVIEWED',
    'PUBLISHED',
    'HIDDED'
);

CREATE TABLE nd.post (
    id serial PRIMARY KEY,
    author_id integer NOT NULL REFERENCES nd.person (id),
    title text NOT NULL CHECK (char_length(title) < 280),
    content text,
    summary text CHECK (char_length(title) < 300),
    created_at timestamp DEFAULT now(),
    updated_at timestamp DEFAULT now(),
    published_at timestamp,
    source text CHECK (char_length(title) < 300)
);

COMMENT ON TABLE nd.post IS 'A post written by a user.';

COMMENT ON COLUMN nd.post.id IS 'The primary key for the post.';

COMMENT ON COLUMN nd.post.author_id IS 'The id of the author user.';

COMMENT ON COLUMN nd.post.title IS 'The title written by the user.';

COMMENT ON COLUMN nd.post.content IS 'The main content text of our post.';

COMMENT ON COLUMN nd.post.created_at IS 'The time this post was created.';

COMMENT ON COLUMN nd.post.updated_at IS 'The time this post was updated.';

CREATE TRIGGER post_updated_at
    BEFORE UPDATE ON nd.post FOR EACH ROW
    EXECUTE PROCEDURE nd_private.set_updated_at ();

CREATE TABLE nd.tag (
    id serial PRIMARY KEY,
    name text NOT NULL UNIQUE CHECK (char_length(name) < 255),
    created_at timestamp DEFAULT now()
);

COMMENT ON TABLE nd.tag IS 'A tag of the post';

COMMENT ON COLUMN nd.tag.id IS 'The primary unique identifier for the tag.';

COMMENT ON COLUMN nd.tag.name IS 'The name of tag.';

COMMENT ON COLUMN nd.tag.created_at IS 'The time this tag was created.';

CREATE TABLE nd.post_tag (
    id serial PRIMARY KEY,
    post_id integer NOT NULL REFERENCES nd.post (id),
    tag_id integer NOT NULL REFERENCES nd.tag (id),
    CONSTRAINT UC_post_tag UNIQUE (post_id, tag_id),
    created_at timestamp DEFAULT now()
);

COMMENT ON TABLE nd.post_tag IS 'The post that tagged';
COMMENT ON COLUMN nd.post_tag.id IS 'The primary unique identifier for the post_tag';
COMMENT ON COLUMN nd.post_tag.post_id IS 'The id of the post';
COMMENT ON COLUMN nd.post_tag.tag_id IS 'The id of the tag';
COMMENT ON COLUMN nd.post_tag.created_at IS 'The time that the post is tagged with a tag name.';

CREATE TYPE nd.post_reaction_type as enum (
    'LIKE',
    'LOVE',
    'DISLIKE'
);

CREATE TABLE nd.post_reaction (
    id serial PRIMARY KEY,
    author_id integer NOT NULL REFERENCES nd.person (id),
    post_id integer NOT NULL REFERENCES nd.post (id),
    type nd.post_reaction_type NOT NULL,
    created_at timestamp DEFAULT now(),
    updated_at timestamp DEFAULT now()
);

CREATE TABLE nd.post_comment (
    id serial PRIMARY KEY,
    author_id integer NOT NULL REFERENCES nd.person (id),
    post_id integer NOT NULL REFERENCES nd.post (id),
    content text NOT NULL,
    created_at timestamp DEFAULT now(),
    updated_at timestamp DEFAULT now()
);

CREATE TYPE nd.post_comment_reaction_type as enum (
    'LIKE',
    'LOVE',
    'DISLIKE',
    'SAD'
);

CREATE TABLE nd.post_comment_reaction (
    id serial PRIMARY KEY,
    author_id integer NOT NULL REFERENCES nd.person (id),
    post_comment_id integer NOT NULL REFERENCES nd.post_comment (id),
    type nd.post_comment_reaction_type NOT NULL,
    created_at timestamp DEFAULT now(),
    updated_at timestamp DEFAULT now()
);

ALTER DEFAULT privileges REVOKE EXECUTE ON functions FROM public;

CREATE FUNCTION nd.person_full_name (person nd.person)
    RETURNS text
    AS $$
    SELECT
        person.first_name || ' ' || person.last_name
$$
LANGUAGE sql
STABLE;

COMMENT ON FUNCTION nd.person_full_name (nd.person) IS 'A person’s full name which is a concatenation of their first and last name.';

CREATE FUNCTION nd.person_latest_post (person nd.person)
    RETURNS nd.post
    AS $$
    SELECT
        post.*
    FROM
        nd.post AS post
    WHERE
        post.author_id = person.id
    ORDER BY
        created_at DESC
    LIMIT 1
$$
LANGUAGE sql
STABLE;

COMMENT ON FUNCTION nd.person_latest_post (nd.person) IS 'Gets the latest post written by the person.';

CREATE FUNCTION nd.search_posts (search text)
    RETURNS SETOF nd.post
    AS $$
    SELECT
        post.*
    FROM
        nd.post AS post
    WHERE
        post.title ILIKE ('%' || search || '%')
        OR post.content ILIKE ('%' || search || '%')
$$
LANGUAGE sql
STABLE;

COMMENT ON FUNCTION nd.search_posts (text) IS 'Returns posts containing a given search term.';

CREATE TABLE nd_private.person_account (
    person_id integer PRIMARY KEY REFERENCES nd.person (id) ON DELETE CASCADE, email text NOT NULL UNIQUE CHECK (email ~* '^.+@.+\..+$'),
    password_hash text NOT NULL
);

COMMENT ON TABLE nd_private.person_account IS 'Private information about a person’s account.';

COMMENT ON COLUMN nd_private.person_account.person_id IS 'The id of the person associated with this account.';

COMMENT ON COLUMN nd_private.person_account.email IS 'The email address of the person.';

COMMENT ON COLUMN nd_private.person_account.password_hash IS 'An opaque hash of the person’s password.';

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE FUNCTION nd.register_person (first_name text, last_name text, email text, PASSWORD text)
    RETURNS nd.person
    AS $$
DECLARE
    person nd.person;
BEGIN
    INSERT INTO nd.person (first_name, last_name)
        VALUES (first_name, last_name)
    RETURNING
        * INTO person;
    INSERT INTO nd_private.person_account (person_id, email, password_hash)
        VALUES (person.id, email, crypt(PASSWORD, gen_salt('bf')));
    RETURN person;
END;
$$
LANGUAGE plpgsql
STRICT
SECURITY DEFINER;

COMMENT ON FUNCTION nd.register_person (text, text, text, text) IS 'Registers a single user and creates an account in our application.';

CREATE TYPE nd.jwt_token AS (
    ROLE text,
    person_id integer
);
        CREATE FUNCTION nd.register_person_and_sign_in (first_name text, last_name text, email text, PASSWORD text )
            RETURNS nd.jwt_token
            AS $$
DECLARE
    person nd.person;
BEGIN
    INSERT INTO nd.person (first_name, last_name)
        VALUES (first_name, last_name)
    RETURNING
        * INTO person;
    INSERT INTO nd_private.person_account (person_id, email, password_hash)
        VALUES (person.id, email, crypt(PASSWORD, gen_salt('bf')));
    RETURN nd.authenticate (email,
        PASSWORD);
END;
$$
LANGUAGE plpgsql
STRICT
SECURITY DEFINER;

COMMENT ON FUNCTION nd.register_person_and_sign_in (text, text, text, text) IS 'Registers a single user, creates an account in our application and then sign in this user immediately.';

CREATE ROLE nd_postgraphile LOGIN PASSWORD 'Abcd1234';

CREATE ROLE nd_anonymous;

GRANT nd_anonymous TO nd_postgraphile;

CREATE ROLE nd_person;

GRANT nd_person TO nd_postgraphile;

CREATE FUNCTION nd.authenticate (email text, PASSWORD text)
    RETURNS nd.jwt_token
    AS $$
DECLARE
    account nd_private.person_account;
BEGIN
    SELECT
        a.* INTO account
    FROM
        nd_private.person_account AS a
    WHERE
        a.email = $1;
        IF account.password_hash = crypt(PASSWORD, account.password_hash) THEN
            RETURN ('nd_person',
                account.person_id)::nd.jwt_token;
        ELSE
            RETURN NULL;
        END IF;
END;
$$
LANGUAGE plpgsql
STRICT
SECURITY DEFINER;

COMMENT ON FUNCTION nd.authenticate (text, text) IS 'Creates a JWT token that will securely identify a person and give them certain permissions.';

CREATE FUNCTION nd.current_person ()
    RETURNS nd.person
    AS $$
    SELECT
        *
    FROM
        nd.person
    WHERE
        id = current_setting('jwt.claims.person_id', TRUE)::integer
$$
LANGUAGE sql
STABLE;

COMMENT ON FUNCTION nd.current_person () IS 'Gets the person who was identified by our JWT.';


CREATE FUNCTION nd.create_post_with_tags (post nd.post, tags text[])
    RETURNS nd.post
    AS $$
DECLARE
    tag_name text;
    tag_id integer;
BEGIN    
    INSERT INTO nd.post(title, content, summary, author_id) values (post.title, post.content, post.summary, post.author_id)
    RETURNING
        * INTO post;
    foreach tag_name in array tags loop
        select id into tag_id from nd.tag where name = tag_name;
        if (tag_id is null) THEN
            insert into nd.tag(name) values (tag_name);
            select id into tag_id from nd.tag where name = tag_name;
        end if;        
        insert into nd.post_tag(post_id, tag_id) values (post.id, tag_id);
    end loop;
    RETURN post;
END;
$$
LANGUAGE plpgsql volatile
STRICT
SECURITY DEFINER;

GRANT usage ON SCHEMA nd TO nd_anonymous, nd_person;

GRANT SELECT ON TABLE nd.person TO nd_anonymous, nd_person;

GRANT UPDATE, DELETE ON TABLE nd.person TO nd_person;

GRANT SELECT ON TABLE nd.post TO nd_anonymous, nd_person;

GRANT INSERT, UPDATE, DELETE ON TABLE nd.post TO nd_person;

GRANT usage ON SEQUENCE nd.post_id_seq
    TO nd_person;

GRANT SELECT ON TABLE nd.tag TO nd_anonymous, nd_person;

GRANT INSERT, UPDATE, DELETE ON TABLE nd.tag TO nd_person;

GRANT usage ON SEQUENCE nd.tag_id_seq
    TO nd_person;

GRANT SELECT ON TABLE nd.post_tag TO nd_anonymous, nd_person;

GRANT INSERT, UPDATE, DELETE ON TABLE nd.post_tag TO nd_person;

GRANT SELECT ON TABLE nd.post_reaction TO nd_anonymous, nd_person;
GRANT INSERT, UPDATE, DELETE ON TABLE nd.post_reaction TO nd_person;

GRANT SELECT ON TABLE nd.post_comment TO nd_anonymous, nd_person;
GRANT INSERT, UPDATE, DELETE ON TABLE nd.post_comment TO nd_person;

GRANT SELECT ON TABLE nd.post_comment_reaction TO nd_anonymous, nd_person;
GRANT INSERT, UPDATE, DELETE ON TABLE nd.post_comment_reaction TO nd_person;

GRANT usage ON SEQUENCE nd.post_tag_id_seq
    TO nd_person;
GRANT usage ON SEQUENCE nd.post_reaction_id_seq
    TO nd_person;
GRANT usage ON SEQUENCE nd.post_comment_id_seq
    TO nd_person;
GRANT usage ON SEQUENCE nd.post_comment_reaction_id_seq
    TO nd_person;

GRANT EXECUTE ON FUNCTION nd.person_full_name (nd.person)
TO nd_anonymous, nd_person;

GRANT EXECUTE ON FUNCTION nd.person_latest_post (nd.person)
TO nd_anonymous, nd_person;

GRANT EXECUTE ON FUNCTION nd.search_posts (text)
TO nd_anonymous, nd_person;

GRANT EXECUTE ON FUNCTION nd.authenticate (text, text)
TO nd_anonymous, nd_person;

GRANT EXECUTE ON FUNCTION nd.current_person ()
TO nd_anonymous, nd_person;

GRANT EXECUTE ON FUNCTION nd.register_person (text, text, text, text)
TO nd_anonymous;

GRANT EXECUTE ON FUNCTION nd.register_person_and_sign_in (text, text, text, text)
TO nd_anonymous;

GRANT EXECUTE ON FUNCTION nd.create_post_with_tags (nd.post, text[])
TO nd_person;

ALTER TABLE nd.person enable ROW level SECURITY;

ALTER TABLE nd.post enable ROW level SECURITY;

ALTER TABLE nd.post_reaction enable ROW level SECURITY;

CREATE POLICY select_person ON nd.person FOR SELECT USING (TRUE);

CREATE POLICY select_post ON nd.post FOR SELECT USING (TRUE);

CREATE POLICY update_person ON nd.person FOR UPDATE TO nd_person USING (id = current_setting('jwt.claims.person_id', TRUE)::integer);

CREATE POLICY delete_person ON nd.person FOR DELETE TO nd_person USING (id = current_setting('jwt.claims.person_id', TRUE)::integer);

CREATE POLICY insert_post ON nd.post FOR INSERT TO nd_person WITH CHECK (author_id = current_setting('jwt.claims.person_id', TRUE)::integer);

CREATE POLICY update_post ON nd.post FOR UPDATE TO nd_person USING (author_id = current_setting('jwt.claims.person_id', TRUE)::integer);

CREATE POLICY delete_post ON nd.post FOR DELETE TO nd_person USING (author_id = current_setting('jwt.claims.person_id', TRUE)::integer);

CREATE POLICY insert_post_reaction ON nd.post_reaction FOR INSERT TO nd_person WITH CHECK (author_id = current_setting('jwt.claims.person_id', TRUE)::integer);

CREATE POLICY update_post_reaction ON nd.post_reaction FOR UPDATE TO nd_person USING (author_id = current_setting('jwt.claims.person_id', TRUE)::integer);

CREATE POLICY delete_post_reaction ON nd.post_reaction FOR DELETE TO nd_person USING (author_id = current_setting('jwt.claims.person_id', TRUE)::integer);

CREATE POLICY insert_post_comment ON nd.post_comment FOR INSERT TO nd_person WITH CHECK (author_id = current_setting('jwt.claims.person_id', TRUE)::integer);

CREATE POLICY update_post_comment ON nd.post_comment FOR UPDATE TO nd_person USING (author_id = current_setting('jwt.claims.person_id', TRUE)::integer);

CREATE POLICY delete_post_comment ON nd.post_comment FOR DELETE TO nd_person USING (author_id = current_setting('jwt.claims.person_id', TRUE)::integer);

CREATE POLICY insert_post_comment_reaction ON nd.post_comment_reaction FOR INSERT TO nd_person WITH CHECK (author_id = current_setting('jwt.claims.person_id', TRUE)::integer);

CREATE POLICY update_post_comment_reaction ON nd.post_comment_reaction FOR UPDATE TO nd_person USING (author_id = current_setting('jwt.claims.person_id', TRUE)::integer);

CREATE POLICY delete_post_comment_reaction ON nd.post_comment_reaction FOR DELETE TO nd_person USING (author_id = current_setting('jwt.claims.person_id', TRUE)::integer);

COMMIT;
