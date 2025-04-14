PRISMA=npx prisma
ENV_LOCAL=.env.local

generate:
	$(PRISMA) generate

studio:
	$(PRISMA) studio

migrate-create:
	dotenv -e $(ENV_LOCAL) -- $(PRISMA) migrate dev --create-only --name $(name)

migrate-dev:
	dotenv -e $(ENV_LOCAL) -- $(PRISMA) migrate dev --name $(name)

migrate-deploy:
	$(PRISMA) migrate deploy

up:
	docker compose up -d

down:
	docker compose down

restart:
	docker compose restart backend

logs:
	docker compose logs -f backend
