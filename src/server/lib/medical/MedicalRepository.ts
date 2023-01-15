import type { Repository } from '../../interfaces/Repository'
import type { Medical } from '../../interfaces/Medical'
import type { MedicalCollection } from '../../types/collections'
import type { MedicalKey } from '../../types/keys'
import { medicalParser } from './MedicalParser'
import { medicalTypes } from '../map/wiki/medical'
import { settings } from '../../config'
import { client } from '../../database'
import * as fs from 'fs'

export class MedicalRepository implements Repository<MedicalCollection>
{
    /**
     * Storage path
     */
    public path: string = settings.app.storage

    /**
     * Collected data
     */
    public collection: Array<MedicalCollection> = []
    
    /**
     * Store data to JSON file
     * 
     * @param key 
     * @returns 
     */
    async storeToJsonFile(key: MedicalKey) {
        console.log(this.path)
        for (const medicalType of medicalTypes[key]) {
            const medical = await medicalParser.fetchSource(medicalType)
            const meds = await medical.parseData()

            if (meds && meds instanceof Array<Medical>) {
                await this.writeJsonFile(medicalType, meds)
                this.collection.push(meds)
            }
        }

        return this.collection
    }

    /**
     * Store JSON file data to Mongo DB
     * 
     * @param key
     * @returns 
     */
    async storeJsonFileToMongoDb(key: string | null = null) {
        try {
            if (key) {
                const data = await this.readJsonFile(key)
                const collection = await client.getCollection('medical')
                const response = await collection.insertMany(data)

                return response
            }
        } catch (error) {
            console.log(error)
        }

        return []
    }

    /**
     * Clear collected data
     */
    async clearCollection() {
        this.collection = []
    }

    /**
     * Write JSON file
     * 
     * @param key 
     * @param data 
     * @returns 
     */
    private async writeJsonFile(key: string, data: Array<Medical>) {
        fs.writeFileSync(`${this.path}/medical/${key}.json`,
            JSON.stringify(data, null, 4),
            {
                encoding: 'utf-8'
            }
        )

        return this
    }

    /**
     * Read JSON file
     * 
     * @param key
     * @returns 
     */
    private async readJsonFile(key: string) {
        const data = fs.readFileSync(`${this.path}/medical/${key}.json`, {
            encoding: 'utf-8',
        })

        return JSON.parse(data)
    }
}