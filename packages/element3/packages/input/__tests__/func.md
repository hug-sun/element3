#### Input Attributes
 - [x] type
 - [X] modelValue
 - [x] maxlength
 - [x] minlength
 - [X] show-word-limit
 - [x] placeholder
 - [X] clearable
 - [X] show-password
 - [X] disabled
 - [X] size
 - [X] prefix-icon
 - [X] suffix-icon	
 - [ ] rows
 - [ ] autosize
 - [X] autocomplete
 - [x] name
 - [x] readonly
 - [x] max
 - [x] min
 - [X] step
 - [X] resize
 - [X] autofocus
 - [X] form
 - [X] label
 - [X] tabindex
 - [X] validate-event
	
##### Input Slots
name	说明
prefix	输入框头部内容，只对 type="text" 有效
suffix	输入框尾部内容，只对 type="text" 有效
prepend	输入框前置内容，只对 type="text" 有效
append	输入框后置内容，只对 type="text" 有效

##### Input Events
事件名称	说明	回调参数
blur	在 Input 失去焦点时触发	(event: Event)
focus	在 Input 获得焦点时触发	(event: Event)
change	仅在输入框失去焦点或用户按下回车时触发	(value: string | number)
input	在 Input 值改变时触发	(value: string | number)
clear	在点击由 clearable 属性生成的清空按钮时触发	—

##### Input Methods
方法名	说明	参数
focus	使 input 获取焦点	—
blur	使 input 失去焦点	—
select	选中 input 中的文字	—

tasking