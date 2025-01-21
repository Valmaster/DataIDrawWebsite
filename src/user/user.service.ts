import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "./user.entity";
import {Repository} from "typeorm";

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(User) protected readonly userRepository: Repository<User>
    ) {
    }

    async save(body: any) {
        return this.userRepository.save(body);
    }

    async findOne(options): Promise<User> {
        return this.userRepository.findOne({
            where: options,
        })
    }

    async getOneUser(email: string): Promise<User | undefined> {
        const user = this.findOne({email });

        if (!user) {
            throw new HttpException(
                'User with this email does not exist',
                HttpStatus.NOT_FOUND
            );
        }
        return user;
    }

    async update(id: number, options) {
        return this.userRepository.update(id, options)
    }

    async getUserById(id: number): Promise<User | undefined> {
        return this.userRepository.findOne({ where: { id } });
    }

}
