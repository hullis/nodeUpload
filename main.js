'use strict'

const fs = require('fs')
const git = require('simple-git')

/**
 * 初始化git
 */
let gitEntity = git("F:/www/my/tuchuang")

// 定时器
setInterval(function() {
	upDataFile()
}, 30000) // 30s检查一次，本地是否有修改

// 修改 README 文件
upDataFile()

function upDataFile() {
	const time = Date()
	gitCommit(time)
}

// commit 提交
function gitCommit(time) {
	gitEntity.status().then(res=>{
		
		const not_added = res.not_added.length === 0;
		const created = res.created.length === 0;
		const deleted = res.deleted.length === 0;
		const modified = res.modified.length === 0;
		const renamed = res.renamed.length === 0;
    if(not_added && created && deleted && modified && renamed)return false;
		gitEntity
		.add('./*')
		.commit('更新图片' + time)
		.push(['-u', 'origin', 'master'], (e) => {
			console.log('commit 成功，时间：' + time, e)
		})
	})
}