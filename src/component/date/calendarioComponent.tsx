import React, { Dispatch, SetStateAction, useState } from 'react';
import DatePicker from 'react-datepicker';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { FaCalendarAlt } from 'react-icons/fa';
import '../date/DatePickerStyles.css';

interface CalendarioProps {
    startDate: Date | null;
    endDate: Date | null;
    setStartDate: (date: Date | null) => void;
    setEndDate: (date: Date | null) => void;
    startDateValid: boolean | null;
    endDateValid: boolean | null;
    validarDatas: () => void;
    cadastro?: boolean;
}
const Calendario: React.FC<CalendarioProps> = ({ 
    startDate, 
    endDate, 
    setStartDate, 
    setEndDate,
    startDateValid,
    endDateValid,
    validarDatas,
    cadastro }) => {

    return (
        <>
        <div>
            <InputGroup className='mb-3'>
                <DatePicker
                    selected={startDate}
                    onChange={(date: Date | null) => { 
                        setStartDate(date);
                        validarDatas();
                    }}
                    className="form-control custom-datepicker"
                    dateFormat="dd/MM/yyyy"
                    placeholderText="Data Inicial"
                    showYearDropdown
                    required={cadastro}
                    scrollableMonthYearDropdown
                    selectsStart
                    startDate={startDate || undefined}
                    endDate={endDate || undefined}
                    maxDate={endDate || undefined}
                />
                <InputGroup.Text>
                    <FaCalendarAlt />
                </InputGroup.Text>
            </InputGroup>

            <InputGroup className='mb-3'>
                <DatePicker
                    selected={endDate}
                    onChange={(date: Date | null) => {
                        setEndDate(date);
                        validarDatas();
                    }}
                    className="form-control custom-datepicker"
                    dateFormat="dd/MM/yyyy"
                    placeholderText="Data Final"
                    selectsEnd
                    required={cadastro}
                    showYearDropdown
                    scrollableMonthYearDropdown
                    startDate={startDate || undefined}
                    endDate={endDate || undefined}
                    minDate={startDate || undefined}
                />
                <InputGroup.Text>
                    <FaCalendarAlt />
                </InputGroup.Text>
            </InputGroup>
        </div>
        </>
    )
}
export default Calendario
