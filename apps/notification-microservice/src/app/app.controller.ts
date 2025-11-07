import { Controller, Logger } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { AppService } from "./app.service";

@Controller()
export class AppController {
	private readonly logger = new Logger(AppController.name);

	constructor(private readonly appService: AppService) {}

	/**
	 * Listen to order_created topic
	 * Triggered when a new order is created
	 */
	@MessagePattern("order_created")
	async handleOrderCreated(@Payload() data: any) {
		this.logger.log("📦 Received order_created event");
		return this.appService.sendOrderNotification(data);
	}

	/**
	 * Listen to payment-succeeded topic
	 * Triggered when payment is processed
	 */
	@MessagePattern("payment-succeeded")
	async handlePaymentSucceeded(@Payload() data: any) {
		this.logger.log("💳 Received payment-succeeded event");
		return this.appService.sendPaymentNotification(data);
	}
}
