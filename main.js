'use strict'

const fs = require('fs')
const git = require('simple-git')

/**
 * 初始化git
 */
let gitEntity = git("F:/www/my/tuchuang/vuepress")

// 定时器
setInterval(function() {
	upDataFile()
}, 3000) //时间不易太短

// 修改 README 文件
upDataFile()

function upDataFile() {
	const time = Date()
	gitCommit(time)
}

// commit 提交
function gitCommit(time) {
	gitEntity.status().then(res=>{
    if(res.not_added.length === 0)return false;
		gitEntity
		.add('./*')
		.commit('更新图片' + time)
		.push(['-u', 'origin', 'master'], (e) => {
			console.log('commit 成功，时间：' + time, e)
		})
	})
}