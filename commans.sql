
/* Create blogs table */
CREATE TABLE blogs (
  id SERIAL PRIMARY KEY,
  author text,
  url text NOT NULL,
  title text NOT NULL,
  likes integer DEFAULT 0 
);


/* Add two blogs to the database */
insert into blogs (author, url, title, likes) values ('Dan Martell', 'danmartell.com', 'Buy Back Your Time', 5);
insert into blogs (author, url, title, likes) values ('Ed Mylett', 'edmylett.com', 'The Power of One More', 6);

/* View entries in blogs */
select * from blogs;