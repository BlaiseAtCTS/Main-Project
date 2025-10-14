import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // ✅ import this
import { HttpClientModule, HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin-approval',
  standalone: true,
  imports: [CommonModule, HttpClientModule], // ✅ add CommonModule here
  templateUrl: './admin-approval.component.html',
  styleUrls: ['./admin-approval.component.css']
})
export class AdminApprovalComponent implements OnInit {
  createRequests: any[] = [];
  deleteRequests: any[] = [];

  private baseUrl = 'http://localhost:8080/api/admin';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadRequests();
  }

  loadRequests() {
    this.http.get<any[]>(`${this.baseUrl}/requests/create`)
      .subscribe(data => this.createRequests = data);

    this.http.get<any[]>(`${this.baseUrl}/requests/delete`)
      .subscribe(data => this.deleteRequests = data);
  }

  updateStatus(id: number, status: string) {
    this.http.put(`${this.baseUrl}/requests/${id}/${status}`, {})
      .subscribe(() => this.loadRequests());
  }
}
