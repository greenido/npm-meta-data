# npm-meta-data

## Motivation
Enble developers to search/manage packages by their meta-data.
For example, answer questions like:
- "Which packages/libraries in my organization are using for *Authentication* ?"
- "What are the crpto pkg that developers are using?"

## Description
1. Fetch npm pkg meta-data and save it to a DB for the future (e.g. integrations with Xray/Artifactory)
2. This is just a prof-of-concept --> We could later take it to many other technologies (e.g. Go, Java etc')
3. The scripts here fetch the *top* packages and use npm-search to bring more _similar_ packages. All the packages are stored with their tags/keywords.

## TODO

* [ ] Check how to merge the data with Artifactory.
* [ ] Build a Docker image for all this code.
* [x] Fetch all the 1000s pkgs: https://gist.github.com/anvaka/8e8fa57c7ee1350e3491
* [x] Mysql instance in GCP.
* [x] Parse the keyword field and normalize the words to another table (keywords).

## 🐠 

<img src="https://source.unsplash.com/random" alt="cool image" />


# SQLs

Use the magic below to quickly break the 'keywords' field into its own table.
It will work only up to 6 (as other fields won't have 6 tags) - So use something better if you wish to have 100% of the tags/keywords.

```

INSERT INTO keywords (tagName, comments) 
SELECT SUBSTRING_INDEX(keywords, ',', 1), comments FROM pkgs
ON DUPLICATE KEY UPDATE howMany = howMany + 1;

```
