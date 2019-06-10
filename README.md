# npm-meta-data

## Description
Fetch npm pkg meta-data and save it locally for the future (integrations)

## SQLs
Use the magic below to quickly break the 'keywords' field into its own table.
It will work only up to 6 (as other fields won't have 6 tags) - So use something better if you wish to have 100% of the tags/keywords.

```

INSERT INTO keywords (tagName, comments) 
SELECT SUBSTRING_INDEX(keywords, ',', 1), comments FROM pkgs
ON DUPLICATE KEY UPDATE howMany = howMany + 1;

```

## TODO

* [ ] Check how to fetch all: https://gist.github.com/anvaka/8e8fa57c7ee1350e3491
* [ ] Mysql instance in GCP.
* [ ] Parse the keyword field and normalize the words to another table (keywords).
* [ ] Bind the data to another source.

## 🐠 

<img src="https://source.unsplash.com/random" alt="cool image" />


