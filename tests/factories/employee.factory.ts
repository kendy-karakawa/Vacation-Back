import { prisma } from "@/config";

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