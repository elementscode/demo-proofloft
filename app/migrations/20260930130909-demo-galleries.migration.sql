-- demo photographer, three galleries, and one client's selections

insert into users (email, name, studio, passwordHash)
     values ('nora@proofloft.studio', 'Nora Vance', 'Nora Vance Photography', crypt('proofloft', genSalt('bf', 12)));

insert into galleries (userId, name, eventDate, clientName, clientEmail, shareToken, passwordHash, status, sharedAt, submittedAt)
     select id, 'Giulia & Sam · Wedding at Villa Cetinale', '2026-09-12', 'Giulia Rossi', 'giulia.rossi@example.com', '7c1e9a4f2b8d6e3a0c5f', crypt('villa2026', genSalt('bf', 12)), 'shared', now() - interval '9 days', null
       from users where email = 'nora@proofloft.studio';

insert into galleries (userId, name, eventDate, clientName, clientEmail, shareToken, passwordHash, status, sharedAt, submittedAt)
     select id, 'Harper & Theo · Engagement, Point Reyes', '2026-09-20', 'Harper Lin', 'harper.lin@example.com', '3f8b2d6a9e1c4b7f0a2d', null, 'submitted', now() - interval '6 days', now() - interval '2 hours'
       from users where email = 'nora@proofloft.studio';

insert into galleries (userId, name, eventDate, clientName, clientEmail, shareToken, passwordHash, status, sharedAt, submittedAt)
     select id, 'The Okafor Family · Autumn session', '2026-09-26', 'Adaeze Okafor', 'adaeze.okafor@example.com', '9a4c7e1f3b6d8a2e5c0b', null, 'draft', null, null
       from users where email = 'nora@proofloft.studio';

insert into photos (galleryId, name, position, width, height, seedKey)
     select g.id, p.name, p.position, p.width, p.height, p.seedKey
       from (values
         ('7c1e9a4f2b8d6e3a0c5f', 'GS_4100.jpg', 1, 1400, 926, 'wedding-01'),
         ('7c1e9a4f2b8d6e3a0c5f', 'GS_4107.jpg', 2, 1400, 934, 'wedding-02'),
         ('7c1e9a4f2b8d6e3a0c5f', 'GS_4117.jpg', 3, 933, 1400, 'wedding-03'),
         ('7c1e9a4f2b8d6e3a0c5f', 'GS_4121.jpg', 4, 1400, 933, 'wedding-04'),
         ('7c1e9a4f2b8d6e3a0c5f', 'GS_4128.jpg', 5, 1400, 933, 'wedding-05'),
         ('7c1e9a4f2b8d6e3a0c5f', 'GS_4138.jpg', 6, 934, 1400, 'wedding-06'),
         ('7c1e9a4f2b8d6e3a0c5f', 'GS_4142.jpg', 7, 932, 1400, 'wedding-07'),
         ('7c1e9a4f2b8d6e3a0c5f', 'GS_4149.jpg', 8, 1400, 933, 'wedding-08'),
         ('7c1e9a4f2b8d6e3a0c5f', 'GS_4159.jpg', 9, 1400, 933, 'wedding-09'),
         ('7c1e9a4f2b8d6e3a0c5f', 'GS_4163.jpg', 10, 1400, 929, 'wedding-10'),
         ('7c1e9a4f2b8d6e3a0c5f', 'GS_4170.jpg', 11, 1400, 929, 'wedding-11'),
         ('7c1e9a4f2b8d6e3a0c5f', 'GS_4180.jpg', 12, 933, 1400, 'wedding-12'),
         ('7c1e9a4f2b8d6e3a0c5f', 'GS_4184.jpg', 13, 1400, 933, 'wedding-13'),
         ('7c1e9a4f2b8d6e3a0c5f', 'GS_4191.jpg', 14, 1400, 933, 'wedding-14'),
         ('7c1e9a4f2b8d6e3a0c5f', 'GS_4201.jpg', 15, 1400, 934, 'wedding-15'),
         ('7c1e9a4f2b8d6e3a0c5f', 'GS_4205.jpg', 16, 1400, 933, 'wedding-16'),
         ('7c1e9a4f2b8d6e3a0c5f', 'GS_4212.jpg', 17, 1400, 933, 'wedding-17'),
         ('7c1e9a4f2b8d6e3a0c5f', 'GS_4222.jpg', 18, 1400, 933, 'wedding-18'),
         ('7c1e9a4f2b8d6e3a0c5f', 'GS_4226.jpg', 19, 934, 1400, 'wedding-19'),
         ('7c1e9a4f2b8d6e3a0c5f', 'GS_4233.jpg', 20, 913, 1400, 'wedding-20'),
         ('7c1e9a4f2b8d6e3a0c5f', 'GS_4243.jpg', 21, 1400, 933, 'wedding-21'),
         ('7c1e9a4f2b8d6e3a0c5f', 'GS_4247.jpg', 22, 1400, 933, 'wedding-22'),
         ('7c1e9a4f2b8d6e3a0c5f', 'GS_4254.jpg', 23, 1400, 933, 'wedding-23'),
         ('7c1e9a4f2b8d6e3a0c5f', 'GS_4264.jpg', 24, 1400, 933, 'wedding-24'),
         ('7c1e9a4f2b8d6e3a0c5f', 'GS_4268.jpg', 25, 1400, 933, 'wedding-25'),
         ('7c1e9a4f2b8d6e3a0c5f', 'GS_4275.jpg', 26, 1400, 933, 'wedding-26'),
         ('7c1e9a4f2b8d6e3a0c5f', 'GS_4285.jpg', 27, 1400, 933, 'wedding-27'),
         ('7c1e9a4f2b8d6e3a0c5f', 'GS_4289.jpg', 28, 933, 1400, 'wedding-28'),
         ('3f8b2d6a9e1c4b7f0a2d', 'HT_4100.jpg', 1, 1400, 934, 'engagement-01'),
         ('3f8b2d6a9e1c4b7f0a2d', 'HT_4107.jpg', 2, 934, 1400, 'engagement-02'),
         ('3f8b2d6a9e1c4b7f0a2d', 'HT_4117.jpg', 3, 1400, 932, 'engagement-03'),
         ('3f8b2d6a9e1c4b7f0a2d', 'HT_4121.jpg', 4, 1400, 933, 'engagement-04'),
         ('3f8b2d6a9e1c4b7f0a2d', 'HT_4128.jpg', 5, 1400, 930, 'engagement-05'),
         ('3f8b2d6a9e1c4b7f0a2d', 'HT_4138.jpg', 6, 1400, 933, 'engagement-06'),
         ('3f8b2d6a9e1c4b7f0a2d', 'HT_4142.jpg', 7, 1400, 934, 'engagement-07'),
         ('3f8b2d6a9e1c4b7f0a2d', 'HT_4149.jpg', 8, 930, 1400, 'engagement-08'),
         ('3f8b2d6a9e1c4b7f0a2d', 'HT_4159.jpg', 9, 1400, 814, 'engagement-09'),
         ('3f8b2d6a9e1c4b7f0a2d', 'HT_4163.jpg', 10, 1400, 932, 'engagement-10'),
         ('3f8b2d6a9e1c4b7f0a2d', 'HT_4170.jpg', 11, 1400, 933, 'engagement-11'),
         ('3f8b2d6a9e1c4b7f0a2d', 'HT_4180.jpg', 12, 1400, 933, 'engagement-12'),
         ('3f8b2d6a9e1c4b7f0a2d', 'HT_4184.jpg', 13, 1400, 933, 'engagement-13'),
         ('3f8b2d6a9e1c4b7f0a2d', 'HT_4191.jpg', 14, 933, 1400, 'engagement-14'),
         ('3f8b2d6a9e1c4b7f0a2d', 'HT_4201.jpg', 15, 1400, 933, 'engagement-15'),
         ('3f8b2d6a9e1c4b7f0a2d', 'HT_4205.jpg', 16, 1400, 933, 'engagement-16'),
         ('3f8b2d6a9e1c4b7f0a2d', 'HT_4212.jpg', 17, 1400, 933, 'engagement-17'),
         ('3f8b2d6a9e1c4b7f0a2d', 'HT_4222.jpg', 18, 1400, 933, 'engagement-18'),
         ('3f8b2d6a9e1c4b7f0a2d', 'HT_4226.jpg', 19, 933, 1400, 'engagement-19'),
         ('3f8b2d6a9e1c4b7f0a2d', 'HT_4233.jpg', 20, 1400, 929, 'engagement-20'),
         ('3f8b2d6a9e1c4b7f0a2d', 'HT_4243.jpg', 21, 1400, 934, 'engagement-21'),
         ('3f8b2d6a9e1c4b7f0a2d', 'HT_4247.jpg', 22, 1400, 933, 'engagement-22'),
         ('3f8b2d6a9e1c4b7f0a2d', 'HT_4254.jpg', 23, 933, 1400, 'engagement-23'),
         ('3f8b2d6a9e1c4b7f0a2d', 'HT_4264.jpg', 24, 1400, 934, 'engagement-24'),
         ('3f8b2d6a9e1c4b7f0a2d', 'HT_4268.jpg', 25, 1400, 937, 'engagement-25'),
         ('3f8b2d6a9e1c4b7f0a2d', 'HT_4275.jpg', 26, 1400, 933, 'engagement-26'),
         ('9a4c7e1f3b6d8a2e5c0b', 'OK_4100.jpg', 1, 1400, 933, 'family-01'),
         ('9a4c7e1f3b6d8a2e5c0b', 'OK_4107.jpg', 2, 1400, 933, 'family-02'),
         ('9a4c7e1f3b6d8a2e5c0b', 'OK_4117.jpg', 3, 934, 1400, 'family-03'),
         ('9a4c7e1f3b6d8a2e5c0b', 'OK_4121.jpg', 4, 1400, 934, 'family-04'),
         ('9a4c7e1f3b6d8a2e5c0b', 'OK_4128.jpg', 5, 1400, 931, 'family-05'),
         ('9a4c7e1f3b6d8a2e5c0b', 'OK_4138.jpg', 6, 1400, 933, 'family-06'),
         ('9a4c7e1f3b6d8a2e5c0b', 'OK_4142.jpg', 7, 1400, 933, 'family-07'),
         ('9a4c7e1f3b6d8a2e5c0b', 'OK_4149.jpg', 8, 1400, 933, 'family-08'),
         ('9a4c7e1f3b6d8a2e5c0b', 'OK_4159.jpg', 9, 1400, 933, 'family-09'),
         ('9a4c7e1f3b6d8a2e5c0b', 'OK_4163.jpg', 10, 934, 1400, 'family-10'),
         ('9a4c7e1f3b6d8a2e5c0b', 'OK_4170.jpg', 11, 1400, 1050, 'family-11'),
         ('9a4c7e1f3b6d8a2e5c0b', 'OK_4180.jpg', 12, 1400, 1120, 'family-12'),
         ('9a4c7e1f3b6d8a2e5c0b', 'OK_4184.jpg', 13, 1400, 933, 'family-13'),
         ('9a4c7e1f3b6d8a2e5c0b', 'OK_4191.jpg', 14, 1400, 927, 'family-14'),
         ('9a4c7e1f3b6d8a2e5c0b', 'OK_4201.jpg', 15, 1400, 933, 'family-15'),
         ('9a4c7e1f3b6d8a2e5c0b', 'OK_4205.jpg', 16, 1400, 933, 'family-16'),
         ('9a4c7e1f3b6d8a2e5c0b', 'OK_4212.jpg', 17, 1400, 933, 'family-17'),
         ('9a4c7e1f3b6d8a2e5c0b', 'OK_4222.jpg', 18, 1400, 931, 'family-18'),
         ('9a4c7e1f3b6d8a2e5c0b', 'OK_4226.jpg', 19, 1400, 933, 'family-19'),
         ('9a4c7e1f3b6d8a2e5c0b', 'OK_4233.jpg', 20, 1400, 934, 'family-20'),
         ('9a4c7e1f3b6d8a2e5c0b', 'OK_4243.jpg', 21, 1400, 927, 'family-21'),
         ('9a4c7e1f3b6d8a2e5c0b', 'OK_4247.jpg', 22, 933, 1400, 'family-22'),
         ('9a4c7e1f3b6d8a2e5c0b', 'OK_4254.jpg', 23, 1400, 891, 'family-23'),
         ('9a4c7e1f3b6d8a2e5c0b', 'OK_4264.jpg', 24, 1400, 932, 'family-24'),
         ('9a4c7e1f3b6d8a2e5c0b', 'OK_4268.jpg', 25, 1400, 933, 'family-25'),
         ('9a4c7e1f3b6d8a2e5c0b', 'OK_4275.jpg', 26, 1400, 933, 'family-26'),
         ('9a4c7e1f3b6d8a2e5c0b', 'OK_4285.jpg', 27, 1400, 1007, 'family-27'),
         ('9a4c7e1f3b6d8a2e5c0b', 'OK_4289.jpg', 28, 934, 1400, 'family-28')
       ) as p (shareToken, name, position, width, height, seedKey)
       join galleries g on g.shareToken = p.shareToken;

insert into favorites (galleryId, photoId, createdAt)
     select galleryId, id, now() - interval '3 hours' + position * interval '4 minutes'
       from photos
      where seedKey in ('engagement-01', 'engagement-03', 'engagement-04', 'engagement-06', 'engagement-08', 'engagement-11', 'engagement-13', 'engagement-14', 'engagement-18', 'engagement-20', 'engagement-22');

insert into comments (galleryId, photoId, author, body, createdAt)
     select p.galleryId, p.id, c.author, c.body, now() - c.minutes * interval '1 minute'
       from (values
         ('engagement-01', 'client', 'This is the one for the mantel. Could we see it a touch warmer?', 170),
         ('engagement-01', 'photographer', 'Absolutely. I will warm it up in the final edit.', 150),
         ('engagement-06', 'client', 'Could you crop this one a little tighter for our save-the-dates?', 140),
         ('engagement-08', 'client', 'Black and white version of this one, please!', 120),
         ('engagement-11', 'client', 'Our parents will want prints of this for sure.', 100),
         ('engagement-14', 'client', 'Theo loves this. Can you soften the shadows on his face a little?', 80),
         ('engagement-22', 'client', 'This one feels so much like us. Thank you, Nora!', 60)
       ) as c (seedKey, author, body, minutes)
       join photos p on p.seedKey = c.seedKey;
