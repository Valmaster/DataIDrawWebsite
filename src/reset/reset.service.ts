import {Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Reset} from "./reset.entity";
import {Repository} from "typeorm";
import {User} from "../user/user.entity";

@Injectable()
export class ResetService {

    constructor(
        @InjectRepository(Reset) private readonly resetRepository: Repository<Reset>
    ) {
    }

    async save(body) {
        return this.resetRepository.save(body);
    }

    async findOne(options): Promise<Reset> {
        return this.resetRepository.findOne({
            where: options,
        })
    }

    async delete(options) {
        return this.resetRepository.delete(options)
    }
}
