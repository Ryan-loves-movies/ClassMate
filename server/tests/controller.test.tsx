import { Request, Response } from 'express';
import axios from 'axios';
import backendFunctions from '@server/database/controllers/moduleController';

describe('populateModules', () => {
    it('should return status 200 and success message if the API call is successful', async () => {
        const mockReq = { body: { ay: '2023-2024' } } as Request;
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        } as unknown as Response;

        // Mock the axios.get call
        const mockAxiosResponse = {
            data: [
                { moduleCode: 'MOD001', title: 'Module 1', semesters: [1, 2] },
                { moduleCode: 'MOD002', title: 'Module 2', semesters: [1] }
            ]
        };
        jest.spyOn(axios, 'get').mockResolvedValue(mockAxiosResponse);

        // Call the function
        await backendFunctions.populateModules(mockReq, mockRes);

        // Expectations
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith({
            message: 'database updated!'
        });
    });

    it('should return status 500 and error message if the API call fails', async () => {
        const mockReq = { body: { ay: '2023-2024' } } as Request;
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        } as unknown as Response;

        // Mock the axios.get call to throw an error
        jest.spyOn(axios, 'get').mockRejectedValue(new Error('API Error'));

        // Call the function
        await backendFunctions.populateModules(mockReq, mockRes);

        // Expectations
        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({
            message: new Error('API Error')
        });
    });
});

// Add more test cases for other functions if needed
