  <p align="center">public rating and complaint system.</p>

R8 is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).

```
r8/
├── apps/
│   ├── auth/
│   ├── r8/
│   ├── media/
│   ├── searchengine/
│   └── gateway/
├── libs/
│   └── commonlib/
│       ├── src/
│       │   ├── db/
│       │   ├── dto/
│       │   ├── entity/
│       │   ├── health/
│       │   ├── interceptor/
│       │   ├── interfaces/
│       │   ├── logger/
│       │   ├── message/
│       │   ├── migrations/
│       │   ├── protopath/
│       │   ├── protos/
│       │   ├── proto_output/
│       │   ├── redis/
│       │   ├── repository/
│       │   ├── response-handlers/
│       │   └── utility/
│       ├── commonlib.module.ts
│       ├── commonlib.service.ts
│       └── index.ts
├── docker/                  # Docker configuration
│   ├── Dockerfile.auth
│   ├── Dockerfile.r8
│   ├── Dockerfile.media
│   ├── Dockerfile.searchengine
│   ├── Dockerfile.gateway
│   └── init-scripts/
│       └── init-db.sql
├── scripts/                 # Startup scripts
│   ├── start-auth.sh
│   ├── start-r8.sh
│   ├── start-media.sh
│   ├── start-searchengine.sh
│   └── start-gateway.sh
├── docker-compose.yml
├── .env
├── .env.local
├── Makefile
└── package.json
```