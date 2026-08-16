import { Controller, Get, Request } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuth } from 'src/common/decorators/jwt-auth.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';

@JwtAuth()
@ApiBearerAuth()
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}
  @Get('stats')
  getStats(@Request() req) {
    const userId = req.userLogged.id;
    return this.dashboardService.getStats(userId);
  }

  @Get('upcoming-tasks')
  getUpcomingTasks(@Request() req) {
    const userId = req.userLogged.id;
    return this.dashboardService.getUpcomingTasks(userId);
  }
}
