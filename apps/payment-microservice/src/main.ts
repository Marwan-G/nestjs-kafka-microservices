/**
 * Payment Microservice - Kafka Consumer
 */

import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { AppModule } from "./app/app.module";

async function bootstrap() {
	const app = await NestFactory.createMicroservice<MicroserviceOptions>(
		AppModule,
		{
			transport: Transport.KAFKA,
			options: {
				client: {
					clientId: "payment-microservice",
					brokers: ["localhost:9092"],
				},
				consumer: {
					groupId: "payment-consumer-group",
				},
			},
		},
	);

	await app.listen();
	Logger.log("🚀 Payment Microservice is listening on Kafka");
}

bootstrap();
