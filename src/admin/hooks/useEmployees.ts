import { useCallback } from 'react'
import { useLocalStorage } from './useLocalStorage'
import type { Employee, EmployeeDraft } from '../types/Employee'

const STORAGE_KEY = 'rc.employee-portal.employees'

export function useEmployees() {
    const [employees, setEmployees, reset] = useLocalStorage<Employee[]>(STORAGE_KEY, [])

    const updateEmployee = useCallback(
        (id: string, draft: EmployeeDraft) => {
            setEmployees(previous =>
                previous.map(employee =>
                    employee.id === id
                        ? {
                              ...employee,
                              name: draft.name.trim(),
                              email: draft.email.trim(),
                              whatsappNumber: draft.whatsappNumber.trim(),
                              department: draft.department?.trim() || undefined,
                          }
                        : employee
                )
            )
        },
        [setEmployees]
    )

    const deleteEmployee = useCallback(
        (id: string) => {
            setEmployees(previous => previous.filter(employee => employee.id !== id))
        },
        [setEmployees]
    )

    const toggleEmployeeActive = useCallback(
        (id: string) => {
            setEmployees(previous =>
                previous.map(employee => (employee.id === id ? { ...employee, active: !employee.active } : employee))
            )
        },
        [setEmployees]
    )

    return {
        employees,
        updateEmployee,
        deleteEmployee,
        toggleEmployeeActive,
        resetEmployees: reset,
    }
}
