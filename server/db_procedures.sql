USE SoloDentalClinic;
GO

-- =============================================
-- PATIENT PROCEDURES
-- =============================================

-- Get All Patients
CREATE OR ALTER PROCEDURE sp_GetPatients
AS
BEGIN
    SELECT * FROM Patient;
END;
GO

-- Create Patient
CREATE OR ALTER PROCEDURE sp_CreatePatient
    @first_name VARCHAR(100),
    @last_name VARCHAR(100),
    @phone VARCHAR(20),
    @medical_history TEXT,
    @date_of_birth DATE,
    @gender VARCHAR(10),
    @email VARCHAR(100),
    @address VARCHAR(255)
AS
BEGIN
    INSERT INTO Patient (first_name, last_name, phone, medical_history, date_of_birth, gender, email, address)
    VALUES (@first_name, @last_name, @phone, @medical_history, @date_of_birth, @gender, @email, @address);
END;
GO

-- Update Patient
CREATE OR ALTER PROCEDURE sp_UpdatePatient
    @id INT,
    @first_name VARCHAR(100),
    @last_name VARCHAR(100),
    @phone VARCHAR(20),
    @medical_history TEXT,
    @date_of_birth DATE,
    @gender VARCHAR(10),
    @email VARCHAR(100),
    @address VARCHAR(255)
AS
BEGIN
    UPDATE Patient 
    SET first_name = @first_name,
        last_name = @last_name,
        phone = @phone,
        medical_history = @medical_history,
        date_of_birth = @date_of_birth,
        gender = @gender,
        email = @email,
        address = @address
    WHERE patient_id = @id;
END;
GO

-- Delete Patient
CREATE OR ALTER PROCEDURE sp_DeletePatient
    @id INT
AS
BEGIN
    DELETE FROM Patient WHERE patient_id = @id;
END;
GO

-- =============================================
-- TREATMENT PROCEDURES
-- =============================================

-- Get All Treatments
CREATE OR ALTER PROCEDURE sp_GetTreatments
AS
BEGIN
    SELECT * FROM Treatment;
END;
GO

-- Create Treatment
CREATE OR ALTER PROCEDURE sp_CreateTreatment
    @name VARCHAR(100),
    @price DECIMAL(10,2)
AS
BEGIN
    INSERT INTO Treatment (name, price) VALUES (@name, @price);
END;
GO

-- Update Treatment
CREATE OR ALTER PROCEDURE sp_UpdateTreatment
    @id INT,
    @name VARCHAR(100),
    @price DECIMAL(10,2)
AS
BEGIN
    UPDATE Treatment 
    SET name = @name, price = @price 
    WHERE treatment_id = @id;
END;
GO

-- Delete Treatment
CREATE OR ALTER PROCEDURE sp_DeleteTreatment
    @id INT
AS
BEGIN
    DELETE FROM Treatment WHERE treatment_id = @id;
END;
GO

-- =============================================
-- PAYMENT PROCEDURES
-- =============================================

-- Get All Payments (with JOINs)
CREATE OR ALTER PROCEDURE sp_GetPayments
AS
BEGIN
    SELECT 
        p.payment_id,
        p.amount,
        p.payment_date,
        p.payment_method,
        p.status,
        pa.first_name AS patient_first_name,
        pa.last_name AS patient_last_name,
        a.appointment_date
    FROM Payment p
    LEFT JOIN Appointment a ON p.appointment_id = a.appointment_id
    LEFT JOIN Patient pa ON a.patient_id = pa.patient_id;
END;
GO

-- Create Payment
CREATE OR ALTER PROCEDURE sp_CreatePayment
    @appointment_id INT,
    @amount DECIMAL(10,2),
    @payment_date DATE,
    @payment_method VARCHAR(50),
    @status VARCHAR(20)
AS
BEGIN
    INSERT INTO Payment (appointment_id, amount, payment_date, payment_method, status)
    VALUES (@appointment_id, @amount, @payment_date, @payment_method, @status);
END;
GO

-- Update Payment
CREATE OR ALTER PROCEDURE sp_UpdatePayment
    @id INT,
    @amount DECIMAL(10,2),
    @payment_method VARCHAR(50),
    @status VARCHAR(20)
AS
BEGIN
    UPDATE Payment 
    SET amount = @amount, 
        payment_method = @payment_method, 
        status = @status 
    WHERE payment_id = @id;
END;
GO

-- Delete Payment
CREATE OR ALTER PROCEDURE sp_DeletePayment
    @id INT
AS
BEGIN
    DELETE FROM Payment WHERE payment_id = @id;
END;
GO

-- =============================================
-- APPOINTMENT PROCEDURES
-- =============================================

-- Get All Appointments
CREATE OR ALTER PROCEDURE sp_GetAppointments
AS
BEGIN
    SELECT 
        a.appointment_id,
        a.appointment_date,
        a.appointment_time, 
        a.status,
        p.first_name AS patient_first_name,
        p.last_name AS patient_last_name,
        d.name AS dentist_name,
        c.room_name
    FROM Appointment a
    LEFT JOIN Patient p ON a.patient_id = p.patient_id
    LEFT JOIN Dentist d ON a.dentist_id = d.dentist_id
    LEFT JOIN ClinicRoom c ON a.room_id = c.room_id;
END;
GO

-- Create Appointment with Conflict Checking
CREATE OR ALTER PROCEDURE sp_CreateAppointment
    @patient_id INT,
    @dentist_id INT,
    @room_id INT,
    @assistant_id INT = NULL,
    @appointment_date DATETIME, 
    @status VARCHAR(20)
AS
BEGIN
    DECLARE @CheckDate DATE = CAST(@appointment_date AS DATE);
    DECLARE @CheckTime TIME = CAST(@appointment_date AS TIME);

    -- Check Dentist Conflict
    IF EXISTS (
        SELECT 1 FROM Appointment 
        WHERE dentist_id = @dentist_id 
        AND appointment_date = @CheckDate 
        AND appointment_time = @CheckTime
        AND status != 'Cancelled'
    )
    BEGIN
        THROW 51000, 'Conflict: This Dentist is already booked at this time.', 1;
        RETURN;
    END

    -- Check Room Conflict
    IF EXISTS (
        SELECT 1 FROM Appointment 
        WHERE room_id = @room_id 
        AND appointment_date = @CheckDate 
        AND appointment_time = @CheckTime
        AND status != 'Cancelled'
    )
    BEGIN
        THROW 51001, 'Conflict: This Room is already booked at this time.', 1;
        RETURN;
    END

    -- Check Assistant Conflict (if assistant is assigned)
    IF @assistant_id IS NOT NULL AND EXISTS (
        SELECT 1 FROM Appointment 
        WHERE assistant_id = @assistant_id 
        AND appointment_date = @CheckDate 
        AND appointment_time = @CheckTime
        AND status != 'Cancelled'
    )
    BEGIN
        THROW 51002, 'Conflict: This Assistant is already booked at this time.', 1;
        RETURN;
    END

    -- If no conflict, insert
    INSERT INTO Appointment (patient_id, dentist_id, room_id, assistant_id, appointment_date, appointment_time, status)
    VALUES (
        @patient_id, 
        @dentist_id, 
        @room_id, 
        @assistant_id,
        @CheckDate, 
        @CheckTime, 
        @status
    );
END;
GO

-- Update Appointment
CREATE OR ALTER PROCEDURE sp_UpdateAppointment
    @id INT,
    @appointment_date DATETIME,
    @status VARCHAR(20),
    @room_id INT
AS
BEGIN
    UPDATE Appointment 
    SET appointment_date = CAST(@appointment_date AS DATE),
        appointment_time = CAST(@appointment_date AS TIME),
        status = @status, 
        room_id = @room_id 
    WHERE appointment_id = @id;
END;
GO

-- Delete Appointment
CREATE OR ALTER PROCEDURE sp_DeleteAppointment
    @id INT
AS
BEGIN
    DELETE FROM Appointment WHERE appointment_id = @id;
END;
GO

-- =============================================
-- DENTIST PROCEDURES
-- =============================================

-- Get All Dentists
CREATE OR ALTER PROCEDURE sp_GetDentists
AS
BEGIN
    SELECT * FROM Dentist;
END;
GO

-- =============================================
-- ASSISTANT PROCEDURES
-- =============================================

-- Get All Assistants
CREATE OR ALTER PROCEDURE sp_GetAssistants
AS
BEGIN
    SELECT * FROM Assistant;
END;
GO


-- =============================================
-- CLINIC ROOM PROCEDURES
-- =============================================

-- Get All Rooms
CREATE OR ALTER PROCEDURE sp_GetClinicRooms
AS
BEGIN
    SELECT * FROM ClinicRoom;
END;
GO
