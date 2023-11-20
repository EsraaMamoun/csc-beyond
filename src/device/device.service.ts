import { Injectable } from '@nestjs/common';
import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';
import { Prisma } from '@prisma/client';
import { DeviceFilter } from './entities/device.entity';

@Injectable()
export class DeviceService {
  create(createDeviceDto: CreateDeviceDto, prisma: Prisma.TransactionClient) {
    return prisma.device.create({
      data: { ...createDeviceDto },
    });
  }

  async findAll(prisma: Prisma.TransactionClient) {
    return prisma.device.findMany();
  }

  async findOne(id: number, prisma: Prisma.TransactionClient) {
    return prisma.device.findFirst({
      where: { id },
    });
  }

  async update(
    id: number,
    updateDeviceDto: UpdateDeviceDto,
    prisma: Prisma.TransactionClient,
  ) {
    return prisma.device.update({
      where: { id },
      data: { ...updateDeviceDto },
    });
  }

  async remove(id: number, prisma: Prisma.TransactionClient) {
    await prisma.device.delete({
      where: { id },
    });

    return true;
  }
}
