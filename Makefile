.PHONY: help dev prod up down logs build rebuild clean migrate install proto

# Variables
COMPOSE = docker compose
NODE_ENV ?= development

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  %-15s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

# ======================
# Environment Setup
# ======================

install: ## Install dependencies
	yarn install

scripts-executable: ## Make all scripts executable
	chmod +x scripts/*.sh

# ======================
# Development
# ======================

dev: ## Start all services in development mode
	NODE_ENV=development $(COMPOSE) up

dev-build: ## Build and start all services in development mode
	NODE_ENV=development $(COMPOSE) up --build

# ======================
# Production
# ======================

prod: ## Start all services in production mode
	NODE_ENV=production $(COMPOSE) up

prod-build: ## Build and start all services in production mode
	NODE_ENV=production $(COMPOSE) up --build

# ======================
# Infrastructure Only
# ======================

infra-up: ## Start only infrastructure services (postgres, redis, elasticsearch)
	$(COMPOSE) up postgres redis elasticsearch

infra-down: ## Stop infrastructure services
	$(COMPOSE) stop postgres redis elasticsearch

# ======================
# Service Management
# ======================

up: ## Start all services
	$(COMPOSE) up

down: ## Stop all services
	$(COMPOSE) down

stop: ## Stop all services without removing containers
	$(COMPOSE) stop

restart: ## Restart all services
	$(COMPOSE) restart

# ======================
# Individual Services
# ======================

auth: ## Start auth service
	$(COMPOSE) up auth

r8: ## Start r8 service
	$(COMPOSE) up r8

media: ## Start media service
	$(COMPOSE) up media

searchengine: ## Start searchengine service
	$(COMPOSE) up searchengine

gateway: ## Start gateway service
	$(COMPOSE) up gateway

# ======================
# Logs
# ======================

logs: ## Show logs for all services
	$(COMPOSE) logs -f

logs-auth: ## Show logs for auth service
	$(COMPOSE) logs -f auth

logs-r8: ## Show logs for r8 service
	$(COMPOSE) logs -f r8

logs-media: ## Show logs for media service
	$(COMPOSE) logs -f media

logs-searchengine: ## Show logs for searchengine service
	$(COMPOSE) logs -f searchengine

logs-gateway: ## Show logs for gateway service
	$(COMPOSE) logs -f gateway

# ======================
# Build
# ======================

build: ## Build all services
	$(COMPOSE) build

build-auth: ## Build auth service
	$(COMPOSE) build auth

build-r8: ## Build r8 service
	$(COMPOSE) build r8

build-media: ## Build media service
	$(COMPOSE) build media

build-searchengine: ## Build searchengine service
	$(COMPOSE) build searchengine

build-gateway: ## Build gateway service
	$(COMPOSE) build gateway

rebuild: ## Rebuild all services from scratch
	$(COMPOSE) build --no-cache

# ======================
# Database
# ======================

migrate: ## Run database migrations
	$(COMPOSE) exec auth yarn typeorm:run

migrate-generate: ## Generate a new migration
	$(COMPOSE) exec auth yarn typeorm:generate

migrate-revert: ## Revert last migration
	$(COMPOSE) exec auth yarn typeorm:revert

db-shell: ## Access PostgreSQL shell
	$(COMPOSE) exec postgres psql -U r8user r8db

# ======================
# Proto Generation
# ======================

proto: ## Generate all protobuf files
	yarn proto:auth
	yarn proto:r8
	yarn proto:media
	yarn proto:searchengine
	yarn proto:health

proto-auth: ## Generate auth protobuf
	yarn proto:auth

proto-r8: ## Generate r8 protobuf
	yarn proto:r8

proto-media: ## Generate media protobuf
	yarn proto:media

proto-searchengine: ## Generate searchengine protobuf
	yarn proto:searchengine

# ======================
# Shell Access
# ======================

shell-auth: ## Access auth container shell
	$(COMPOSE) exec auth sh

shell-r8: ## Access r8 container shell
	$(COMPOSE) exec r8 sh

shell-media: ## Access media container shell
	$(COMPOSE) exec media sh

shell-searchengine: ## Access searchengine container shell
	$(COMPOSE) exec searchengine sh

shell-gateway: ## Access gateway container shell
	$(COMPOSE) exec gateway sh

# ======================
# Clean Up
# ======================

clean: ## Stop and remove all containers, networks, and volumes
	$(COMPOSE) down -v

clean-images: ## Remove all project images
	docker images | grep r8_ | awk '{print $$3}' | xargs docker rmi -f

prune: ## Remove all unused Docker resources
	docker system prune -af --volumes

# ======================
# Status
# ======================

ps: ## Show status of all services
	$(COMPOSE) ps

top: ## Show running processes in containers
	$(COMPOSE) top

stats: ## Show container resource usage statistics
	docker stats