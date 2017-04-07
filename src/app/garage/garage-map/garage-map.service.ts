import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { AppConfigService } from '../../app-config.service';
import { Subject } from 'rxjs/Subject';
@Injectable()
export class GarageMapService {
	private url: string = '/maps';
	public subject: Subject<any> = new Subject<any>();
	constructor(private http: Http, private appConfigService: AppConfigService){}
	public getRoads(id: number) {
		return this.http.get(this.appConfigService.baseUrl + this.url + '/' + id)
						.map((response: Response) => {
							return response.json();
							// let roads = response.json();
							// this.subject.next(roads);
						})
	}
}