select p.id as post_id, title, content, img, profile_pic, date_created, username as author_username from helo_posts p as post_id
join helo_users u as author_username on author_username.id = post_id.author_id
where lower(title) like $1 AND author_username.id != $2
order by date_created asc;