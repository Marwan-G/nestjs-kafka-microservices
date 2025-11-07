import { Body, Controller, Post } from "@nestjs/common";
import { AppService } from "./app.service";

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}

	// Send a message to Kafka
	@Post("order")
	async createOrder(@Body() body: { topic: string; message: object }) {
		return await this.appService.sendOrder(body.topic, body.message);
	}
}
