find . -iname "*.JPEG" | xargs -L1 -I{} mogrify -resize 30% "{}"
