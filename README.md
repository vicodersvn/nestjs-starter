# Vicoders NestJS Starter
- [Vicoders NestJS Starter](#vicoders-nestjs-starter)
  - [Giới thiệu](#giới-thiệu)
  - [Setup](#setup)
  - [Cấu trúc thư mục](#cấu-trúc-thư-mục)

<a name="giới-thiệu"></a>
## Giới thiệu

Thông tin về [NestJS](https://docs.nestjs.com/)

<a name="setup"></a>
## Setup

Clone project từ github

```
git clone https://github.com/vicodersvn/nestjs-starter
```
<a name="cấu-trúc-thư-mục"></a>
## Cấu trúc thư mục

Dùng lệnh tree để xem cấu trúc thư mục 
```
tree -L 4 -I 'node_modules|dist|test|README*|tsconfig*|yarn*'

.
├── nest-cli.json
├── package.json
├── src
│   ├── app.controller.spec.ts
│   ├── app.controller.ts
│   ├── app.module.ts
│   ├── app.service.ts
│   ├── main.ts
│   └── shared
│       ├── pipes
│       ├── services
│       │   ├── api-response
│       │   ├── base.service.ts
│       │   ├── hash
│       │   ├── notification
│       │   ├── pagination.ts
│       │   └── services.module.ts
│       ├── shared.module.ts
│       ├── transformers
│       │   └── transformer.ts
│       ├── utils
│       │   └── default-pagination-option.utilty.ts
│       └── validators
│           ├── find-many-query-params.validator.ts
│           └── find-one-params.validator.ts
└── webpack-hmr.config.js
```