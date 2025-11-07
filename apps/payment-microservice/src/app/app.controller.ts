import { Controller, Logger } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { AppService } from "./app.service";

@Controller()
export class AppController {
	private readonly logger = new Logger(AppController.name);

	constructor(private readonly appService: AppService) {}

	@MessagePattern("process_payment")
	async handlePayment(@Payload() data: any) {
		this.logger.log("💳 Received payment request");
		return this.appService.processPayment(data);
	}
}
