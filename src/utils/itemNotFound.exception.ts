import { NotFoundException } from '@nestjs/common';

class ItemNotFoundException extends NotFoundException {
    constructor(item: string, field: string, value: string | number) {
        super(`${item} with ${field} '${value}' not found`);
    }
}
