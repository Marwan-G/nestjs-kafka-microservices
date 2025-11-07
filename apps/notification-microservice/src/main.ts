/**
 * Notification Microservice - Kafka Consumer Only
 * Listens to: order_created and payment-succeeded topics
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
					clientId: "notification-microservice",
					brokers: ["localhost:9092"],
				},
				consumer: {
					groupId: "notification-consumer-group",
				},
			},
		},
	);

	await app.listen();
	Logger.log("🚀 Notification Microservice is listening on Kafka");
}

bootstrap();
