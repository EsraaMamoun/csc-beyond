import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { DeviceService } from './device.service';
import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';
import { PrismaService } from 'src/prisma.service';
import { DeviceFilter } from './entities/device.entity';
import { ApiTags } from '@nestjs/swagger';
import { ApiHeaders } from 'src/decorators/headers.decorator';

@ApiTags('Device')
@ApiHeaders({ withAuth: false })
@Controller('device')
export class DeviceController {
  constructor(
    private readonly deviceService: DeviceService,
    private readonly prismaService: PrismaService,
  ) {}

  @Post()
  create(@Body() createDeviceDto: CreateDeviceDto) {
    return this.prismaService.$transaction(async (prisma) => {
      return this.deviceService.create(createDeviceDto, prisma);
    });
  }

  @Get()
  findAll() {
    return this.prismaService.$transaction(async (prisma) => {
      return this.deviceService.findAll(prisma);
    });
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.prismaService.$transaction(async (prisma) => {
      return this.deviceService.findOne(+id, prisma);
    });
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDeviceDto: UpdateDeviceDto) {
    return this.prismaService.$transaction(async (prisma) => {
      return this.deviceService.update(+id, updateDeviceDto, prisma);
    });
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.prismaService.$transaction(async (prisma) => {
      return this.deviceService.remove(+id, prisma);
    });
  }
}
