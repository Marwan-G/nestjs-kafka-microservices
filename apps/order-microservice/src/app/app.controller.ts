import { Controller, Logger } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { AppService } from "./app.service";

@Controller()
export class AppController {
	private readonly logger = new Logger(AppController.name);

	constructor(private readonly appService: AppService) {}

	@MessagePattern("order_created")
	async handleOrderCreated(@Payload() data: any) {
		this.logger.log("📨 Received message on pattern: order_created");
		return this.appService.processOrder(data);
	}
}
