.PHONY: build test clean zip

ZIP=ableton.zip

test:
	node test/test.js

clean:
	rm -rf $(ZIP)

zip:
	git archive --format zip --output $(ZIP) master
