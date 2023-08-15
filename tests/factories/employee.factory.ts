import { prisma } from "@/config";
import { AddEmployeeData } from "@/protocols";

export async function createEmployee(params: string) {
    const hireDate = new Date("2023-08-10")
    return await prisma.employee.create({
        data:{
            name: params,
            position: "back-end",
            hireDate 
        }
    })
}

export async function createEmployeeWithParamsData(data: AddEmployeeData) {
    return await prisma.employee.create({data})
}