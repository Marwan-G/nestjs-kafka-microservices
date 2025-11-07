import { Inject, Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { ClientKafka } from "@nestjs/microservices";
import { lastValueFrom } from "rxjs";

@Injectable()
export class AppService implements OnModuleInit {
	private readonly logger = new Logger(AppService.name);

	constructor(
		@Inject("KAFKA_SERVICE") private readonly kafkaClient: ClientKafka,
	) {}

	async onModuleInit() {
		try {
			// Connect to Kafka when module initializes
			this.logger.log("🔌 Connecting to Kafka...");
			await this.kafkaClient.connect();
			this.logger.log("✅ Connected to Kafka successfully");
		} catch (error) {
			this.logger.error("❌ Failed to connect to Kafka:", error);
			throw error;
		}
	}

	// Send a message to Kafka topic and return status
	async sendOrder(topic: string, message: unknown) {
		try {
			this.logger.log(`📤 Sending message to topic: ${topic}`);
			const kafkaResponse = await lastValueFrom(
				this.kafkaClient.emit(topic, message),
			);
			this.logger.log(`✅ Message sent successfully to ${topic}`);
			return {
				status: "success",
				message: "Message sent to Kafka",
				topic,
				kafkaResponse,
			};
		} catch (error) {
			this.logger.error(`❌ Error sending message to ${topic}:`, error);
			throw error;
		}
	}
}
