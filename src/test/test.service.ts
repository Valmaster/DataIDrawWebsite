import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import { Test } from '@nestjs/testing';

@Injectable()
export class TestService {


    constructor(
        @InjectRepository(Test) protected readonly testRepository: Repository<Test>
    ) {
    }

    async save(body) {
        return this.testRepository.save(body);
    }

    async findOne(options): Promise<Test> {
        return this.testRepository.findOne({
            where: options,
        })
    }

    async delete(options) {
        return this.testRepository.delete(options)
    }
}