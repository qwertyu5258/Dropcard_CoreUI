import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { CurrentUserService } from '../../../services/current-user.service'
import { UtilsService } from '../../../services/utils.service'
import { UsersService } from '../../../services/users.service'
import { User } from 'app/models/user';

@Component({
  templateUrl: './user-list.component.html'
})
export class UserListComponent implements OnInit {

  users: User[]
  totalPage: number[] = []
  usersCount: number
  rowPerPage: number = 10
  currentPage: number

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private currentUserService: CurrentUserService, private usersService:UsersService, private utilsService: UtilsService) {

  }

  ngOnInit() {
    this.loadData(1)
    this.loadPage()
  }
  
  loadData(page:number) {
    this.currentPage = page
    this.users = []
    this.usersService.getUsers(page, 10).subscribe(data => {
      data.users.forEach( (item, index) => {
        let user = new User()
        user.id = item.id
        user.hospital = item.hospital
        user.update = this.utilsService.dateFormating(new Date(item.update), '#YYYY#-#MM#-#DD# #hh#:#mm#:#ss#')
        user.name = item.name
        user.phone = item.phone
        user.authority = item.authority
      
        this.users.push(user)
      })
    }, e => {
      console.log(e.result)
    })
  }

  loadPage() {
    this.totalPage = []
    this.usersCount = this.usersService.usersCount.cnt
    let cnt = Math.ceil( this.usersCount / this.rowPerPage)
    
    for (var i = 1; i <= cnt; i++ ) {
      this.totalPage.push(i)
    }
    // this.usersService.getUsersCount().subscribe(data => {
    //   this.usersCount = data.count
    //   let cnt = Math.ceil( this.usersCount / this.rowPerPage)
    //   for (var i = 1; i <= cnt; i++ ) {
    //     this.totalPage.push(i)
    //   }
    //   console.log(this.totalPage)
    // }, e => {
    //   console.log(e.result)
    // })
  }
  
  prev() {
    if(this.currentPage > 1) {
      this.loadData(this.currentPage - 1)
    }
  }

  next() {
    if(this.currentPage < this.totalPage.length ) {
      this.loadData(this.currentPage + 1)
    }
  }

  update(id: string) {
    this.router.navigateByUrl('/admin/user-list/user-detail/' + id)
  }

  delete(id: string) {
    this.usersService.deleteUser(id).subscribe(data => {     
      this.users = this.users.filter(function(user){
        return user.id !== id;
      })
      this.usersService.usersCount.cnt -= 1
      this.loadPage()

      
    }, e => {
      console.log(e.result)
    })
  }
}
