.DEFAULT_GOAL := help

help:
	@cat $(MAKEFILE_LIST) | grep -e "^[a-zA-Z_\-]*: *.*## *" | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

fill-hours: ## Fill hours with user and password auth in background
	@echo "🚀 Starting to fill hours"
	@npm run start
	@echo "✅ Your hours have been updated!"

fill-hours-headed: ## Fill hours with user and password auth showing the process
	@echo "🚀 Starting to fill hours"
	@npm run start:headed
	@echo "✅ Your hours have been updated!"
